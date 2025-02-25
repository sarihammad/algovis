from typing import Dict, List, Tuple, Callable
import numpy as np
from scipy.optimize import linprog, minimize
import networkx as nx

def simplex(
    c: List[float],
    A: List[List[float]],
    b: List[float],
    maximize: bool = True
) -> List[Dict]:
    """
    Simplex algorithm implementation for linear programming that returns visualization steps.
    
    Args:
        c: Coefficients of the objective function
        A: Matrix of coefficients for the constraints
        b: Right-hand side values of the constraints
        maximize: Whether to maximize (True) or minimize (False) the objective function
        
    Returns:
        List of steps for visualization
    """
    steps: List[Dict] = []
    
    # Convert maximization to minimization if needed
    if maximize:
        c = [-x for x in c]
    
    # Initialize the visualization state
    steps.append({
        'type': 'simplex',
        'tableau': None,
        'basic_vars': [],
        'current_pivot': None,
        'objective_value': None,
        'message': 'Starting Simplex algorithm'
    })
    
    # Solve using scipy's linprog
    result = linprog(
        c,
        A_ub=A,
        b_ub=b,
        method='simplex'
    )
    
    if result.success:
        steps.append({
            'type': 'simplex',
            'tableau': result.tableau.tolist() if hasattr(result, 'tableau') else None,
            'basic_vars': [],
            'current_pivot': None,
            'objective_value': -result.fun if maximize else result.fun,
            'solution': result.x.tolist(),
            'message': f'Found optimal solution with objective value: {-result.fun if maximize else result.fun}'
        })
    else:
        steps.append({
            'type': 'simplex',
            'tableau': None,
            'basic_vars': [],
            'current_pivot': None,
            'objective_value': None,
            'message': 'No solution found'
        })
    
    return steps

def max_flow(graph: nx.DiGraph, source: str, sink: str) -> List[Dict]:
    """
    Ford-Fulkerson algorithm implementation for maximum flow that returns visualization steps.
    
    Args:
        graph: NetworkX directed graph object
        source: Source node
        sink: Sink node
        
    Returns:
        List of steps for visualization
    """
    steps: List[Dict] = []
    flow_graph = graph.copy()
    
    # Initialize flow values
    for u, v in flow_graph.edges():
        flow_graph[u][v]['flow'] = 0
    
    def find_path(g: nx.DiGraph, s: str, t: str) -> Tuple[bool, List[Tuple[str, str]]]:
        visited = {s}
        stack = [(s, [])]
        while stack:
            vertex, path = stack.pop()
            for neighbor in g.neighbors(vertex):
                residual = g[vertex][neighbor]['capacity'] - g[vertex][neighbor]['flow']
                if residual > 0 and neighbor not in visited:
                    if neighbor == t:
                        return True, path + [(vertex, neighbor)]
                    visited.add(neighbor)
                    stack.append((neighbor, path + [(vertex, neighbor)]))
        return False, []
    
    # Initialize visualization
    steps.append({
        'type': 'max_flow',
        'graph': {
            'nodes': list(flow_graph.nodes()),
            'edges': [(u, v, flow_graph[u][v]) for u, v in flow_graph.edges()],
        },
        'current_path': None,
        'total_flow': 0,
        'message': 'Starting Ford-Fulkerson algorithm'
    })
    
    # Find augmenting paths
    total_flow = 0
    while True:
        path_exists, path = find_path(flow_graph, source, sink)
        if not path_exists:
            break
            
        # Find minimum residual capacity along the path
        min_residual = float('inf')
        for u, v in path:
            residual = flow_graph[u][v]['capacity'] - flow_graph[u][v]['flow']
            min_residual = min(min_residual, residual)
        
        # Update flow values
        for u, v in path:
            flow_graph[u][v]['flow'] += min_residual
            if not flow_graph.has_edge(v, u):
                flow_graph.add_edge(v, u, capacity=0, flow=0)
            flow_graph[v][u]['flow'] -= min_residual
            
        total_flow += min_residual
        
        steps.append({
            'type': 'max_flow',
            'graph': {
                'nodes': list(flow_graph.nodes()),
                'edges': [(u, v, flow_graph[u][v]) for u, v in flow_graph.edges()],
            },
            'current_path': path,
            'total_flow': total_flow,
            'message': f'Found augmenting path with flow {min_residual}'
        })
    
    # Add final step
    steps.append({
        'type': 'max_flow',
        'graph': {
            'nodes': list(flow_graph.nodes()),
            'edges': [(u, v, flow_graph[u][v]) for u, v in flow_graph.edges()],
        },
        'current_path': None,
        'total_flow': total_flow,
        'message': f'Maximum flow: {total_flow}'
    })
    
    return steps

def min_cost_flow(
    graph: nx.DiGraph,
    source: str,
    sink: str,
    demand: float
) -> List[Dict]:
    """
    Successive Shortest Path algorithm implementation for minimum cost flow that returns visualization steps.
    
    Args:
        graph: NetworkX directed graph object
        source: Source node
        sink: Sink node
        demand: Required flow value
        
    Returns:
        List of steps for visualization
    """
    steps: List[Dict] = []
    flow_graph = graph.copy()
    
    # Initialize flow values and costs
    for u, v in flow_graph.edges():
        flow_graph[u][v]['flow'] = 0
    
    def find_shortest_path(g: nx.DiGraph, s: str, t: str) -> Tuple[bool, List[Tuple[str, str]], float]:
        distances = {node: float('inf') for node in g.nodes()}
        distances[s] = 0
        previous = {node: None for node in g.nodes()}
        
        # Bellman-Ford algorithm
        for _ in range(len(g.nodes()) - 1):
            for u, v in g.edges():
                residual = g[u][v]['capacity'] - g[u][v]['flow']
                if residual > 0:
                    cost = g[u][v]['cost']
                    if distances[u] + cost < distances[v]:
                        distances[v] = distances[u] + cost
                        previous[v] = u
        
        if distances[t] == float('inf'):
            return False, [], 0
            
        # Reconstruct path
        path = []
        current = t
        while current is not None:
            prev = previous[current]
            if prev is not None:
                path.append((prev, current))
            current = prev
        path.reverse()
        
        return True, path, distances[t]
    
    # Initialize visualization
    steps.append({
        'type': 'min_cost_flow',
        'graph': {
            'nodes': list(flow_graph.nodes()),
            'edges': [(u, v, flow_graph[u][v]) for u, v in flow_graph.edges()],
        },
        'current_path': None,
        'total_flow': 0,
        'total_cost': 0,
        'message': 'Starting Successive Shortest Path algorithm'
    })
    
    # Find successive shortest paths
    total_flow = 0
    total_cost = 0
    
    while total_flow < demand:
        path_exists, path, path_cost = find_shortest_path(flow_graph, source, sink)
        if not path_exists:
            break
            
        # Find minimum residual capacity along the path
        min_residual = min(
            flow_graph[u][v]['capacity'] - flow_graph[u][v]['flow']
            for u, v in path
        )
        min_residual = min(min_residual, demand - total_flow)
        
        # Update flow values
        for u, v in path:
            flow_graph[u][v]['flow'] += min_residual
            total_cost += min_residual * flow_graph[u][v]['cost']
            
        total_flow += min_residual
        
        steps.append({
            'type': 'min_cost_flow',
            'graph': {
                'nodes': list(flow_graph.nodes()),
                'edges': [(u, v, flow_graph[u][v]) for u, v in flow_graph.edges()],
            },
            'current_path': path,
            'total_flow': total_flow,
            'total_cost': total_cost,
            'message': f'Found path with flow {min_residual} and cost {path_cost}'
        })
    
    # Add final step
    steps.append({
        'type': 'min_cost_flow',
        'graph': {
            'nodes': list(flow_graph.nodes()),
            'edges': [(u, v, flow_graph[u][v]) for u, v in flow_graph.edges()],
        },
        'current_path': None,
        'total_flow': total_flow,
        'total_cost': total_cost,
        'message': f'Minimum cost flow: cost = {total_cost}, flow = {total_flow}'
    })
    
    return steps

def gradient_descent(
    objective_fn: Callable[[np.ndarray], float],
    gradient_fn: Callable[[np.ndarray], np.ndarray],
    initial_point: np.ndarray,
    learning_rate: float = 0.01,
    max_iterations: int = 1000,
    tolerance: float = 1e-6
) -> List[Dict]:
    """
    Gradient descent implementation for nonlinear optimization.
    
    Args:
        objective_fn: Function to minimize
        gradient_fn: Gradient of the objective function
        initial_point: Starting point
        learning_rate: Learning rate for gradient updates
        max_iterations: Maximum number of iterations
        tolerance: Convergence tolerance
        
    Returns:
        List of steps for visualization
    """
    steps: List[Dict] = []
    current_point = initial_point.copy()
    
    steps.append({
        'type': 'nonlinear',
        'point': current_point.tolist(),
        'objective_value': float(objective_fn(current_point)),
        'gradient': gradient_fn(current_point).tolist(),
        'iteration': 0,
        'message': 'Starting gradient descent optimization'
    })
    
    for i in range(max_iterations):
        gradient = gradient_fn(current_point)
        new_point = current_point - learning_rate * gradient
        
        # Calculate improvement
        old_value = objective_fn(current_point)
        new_value = objective_fn(new_point)
        improvement = old_value - new_value
        
        steps.append({
            'type': 'nonlinear',
            'point': new_point.tolist(),
            'objective_value': float(new_value),
            'gradient': gradient.tolist(),
            'iteration': i + 1,
            'improvement': float(improvement),
            'message': f'Iteration {i+1}: objective value = {new_value:.6f}'
        })
        
        if np.linalg.norm(gradient) < tolerance:
            break
            
        current_point = new_point
    
    return steps

def constrained_optimization(
    objective_fn: Callable[[np.ndarray], float],
    constraints: List[Dict],
    initial_point: np.ndarray,
    method: str = 'SLSQP'
) -> List[Dict]:
    """
    Constrained nonlinear optimization using SciPy's minimize function.
    
    Args:
        objective_fn: Function to minimize
        constraints: List of constraint dictionaries
        initial_point: Starting point
        method: Optimization method to use
        
    Returns:
        List of steps for visualization
    """
    steps: List[Dict] = []
    
    def callback(xk):
        steps.append({
            'type': 'constrained',
            'point': xk.tolist(),
            'objective_value': float(objective_fn(xk)),
            'iteration': len(steps),
            'message': f'Iteration {len(steps)}: evaluating point {xk.tolist()}'
        })
    
    result = minimize(
        objective_fn,
        initial_point,
        method=method,
        constraints=constraints,
        callback=callback
    )
    
    if result.success:
        steps.append({
            'type': 'constrained',
            'point': result.x.tolist(),
            'objective_value': float(result.fun),
            'iteration': len(steps),
            'message': f'Found optimal solution: {result.x.tolist()}'
        })
    else:
        steps.append({
            'type': 'constrained',
            'point': result.x.tolist(),
            'objective_value': float(result.fun),
            'iteration': len(steps),
            'message': 'Optimization failed to converge'
        })
    
    return steps 