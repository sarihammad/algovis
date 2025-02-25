from flask import Blueprint, jsonify, request
from algorithms import (
    graph_traversal,
    dynamic_programming,
    optimization,
    utils
)
from utils.benchmarking import measure_performance, analyze_complexity, estimate_complexity
import networkx as nx
import numpy as np

api = Blueprint('api', __name__)

@api.route('/graph/sample', methods=['GET'])
def get_sample_graph():
    """Get a sample graph for testing."""
    graph = utils.create_sample_graph()
    return jsonify({
        'nodes': [{'id': node} for node in graph.nodes()],
        'edges': [
            {
                'source': u,
                'target': v,
                'weight': graph[u][v].get('weight', 1)
            }
            for u, v in graph.edges()
        ]
    })

@api.route('/graph/traverse/<algorithm>', methods=['POST'])
def traverse_graph(algorithm):
    """Execute graph traversal algorithms."""
    data = request.get_json()
    graph = nx.Graph()
    
    # Build graph from request data
    for node in data['nodes']:
        graph.add_node(node['id'])
        if 'pos' in node:
            graph.nodes[node['id']]['pos'] = node['pos']
            
    for edge in data['edges']:
        graph.add_edge(
            edge['source'],
            edge['target'],
            weight=edge.get('weight', 1)
        )
    
    if algorithm == 'dfs':
        steps = graph_traversal.dfs(graph, data['start'])
    elif algorithm == 'bfs':
        steps = graph_traversal.bfs(graph, data['start'])
    elif algorithm == 'dijkstra':
        steps = graph_traversal.dijkstra(graph, data['start'], data['end'])
    elif algorithm == 'astar':
        # Custom heuristic function if provided
        heuristic = None
        if 'heuristic' in data:
            def heuristic(n1, n2):
                # Example: Manhattan distance
                pos1 = graph.nodes[n1]['pos']
                pos2 = graph.nodes[n2]['pos']
                return abs(pos1[0] - pos2[0]) + abs(pos1[1] - pos2[1])
                
        steps = graph_traversal.astar(
            graph,
            data['start'],
            data['end'],
            heuristic_fn=heuristic
        )
    else:
        return jsonify({'error': 'Invalid algorithm'}), 400
    
    return jsonify({'steps': steps})

@api.route('/dp/knapsack', methods=['POST'])
def solve_knapsack():
    """Execute 0/1 Knapsack algorithm."""
    data = request.get_json()
    steps = dynamic_programming.knapsack(
        weights=data['weights'],
        values=data['values'],
        capacity=data['capacity']
    )
    return jsonify({'steps': steps})

@api.route('/dp/lcs', methods=['POST'])
def solve_lcs():
    """Execute Longest Common Subsequence algorithm."""
    data = request.get_json()
    steps = dynamic_programming.lcs(
        str1=data['str1'],
        str2=data['str2']
    )
    return jsonify({'steps': steps})

@api.route('/dp/matrix-chain', methods=['POST'])
def solve_matrix_chain():
    """Execute Matrix Chain Multiplication algorithm."""
    data = request.get_json()
    steps = dynamic_programming.matrix_chain(
        dimensions=data['dimensions']
    )
    return jsonify({'steps': steps})

@api.route('/optimization/simplex', methods=['POST'])
def solve_simplex():
    """Execute Simplex algorithm for linear programming."""
    data = request.get_json()
    steps = optimization.simplex(
        c=data['objective'],
        A=data['constraints'],
        b=data['bounds'],
        maximize=data.get('maximize', True)
    )
    return jsonify({'steps': steps})

@api.route('/optimization/max-flow', methods=['POST'])
def solve_max_flow():
    """Execute Maximum Flow algorithm."""
    data = request.get_json()
    graph = nx.DiGraph()
    
    # Build graph from request data
    for node in data['nodes']:
        graph.add_node(node['id'])
    for edge in data['edges']:
        graph.add_edge(
            edge['source'],
            edge['target'],
            capacity=edge.get('capacity', 1)
        )
    
    steps = optimization.max_flow(
        graph=graph,
        source=data['source'],
        sink=data['sink']
    )
    return jsonify({'steps': steps})

@api.route('/optimization/min-cost-flow', methods=['POST'])
def solve_min_cost_flow():
    """Execute Minimum Cost Flow algorithm."""
    data = request.get_json()
    graph = nx.DiGraph()
    
    # Build graph from request data
    for node in data['nodes']:
        graph.add_node(node['id'])
    for edge in data['edges']:
        graph.add_edge(
            edge['source'],
            edge['target'],
            capacity=edge.get('capacity', 1),
            cost=edge.get('cost', 1)
        )
    
    steps = optimization.min_cost_flow(
        graph=graph,
        source=data['source'],
        sink=data['sink'],
        demand=data['demand']
    )
    return jsonify({'steps': steps})

@api.route('/optimization/gradient-descent', methods=['POST'])
def solve_gradient_descent():
    """Execute gradient descent optimization."""
    data = request.get_json()
    
    # Define the objective function and its gradient
    def objective_fn(x):
        return np.sum(x**2)  # Example: minimize sum of squares
        
    def gradient_fn(x):
        return 2 * x  # Gradient of sum of squares
    
    initial_point = np.array(data['initial_point'])
    learning_rate = data.get('learning_rate', 0.01)
    max_iterations = data.get('max_iterations', 1000)
    tolerance = data.get('tolerance', 1e-6)
    
    steps = optimization.gradient_descent(
        objective_fn=objective_fn,
        gradient_fn=gradient_fn,
        initial_point=initial_point,
        learning_rate=learning_rate,
        max_iterations=max_iterations,
        tolerance=tolerance
    )
    return jsonify({'steps': steps})

@api.route('/optimization/constrained', methods=['POST'])
def solve_constrained():
    """Execute constrained nonlinear optimization."""
    data = request.get_json()
    
    # Define the objective function
    def objective_fn(x):
        return np.sum(x**2)  # Example: minimize sum of squares
    
    initial_point = np.array(data['initial_point'])
    constraints = data['constraints']  # List of constraint dictionaries
    method = data.get('method', 'SLSQP')
    
    steps = optimization.constrained_optimization(
        objective_fn=objective_fn,
        constraints=constraints,
        initial_point=initial_point,
        method=method
    )
    return jsonify({'steps': steps})

@api.route('/benchmark/<algorithm>', methods=['POST'])
def benchmark_algorithm(algorithm):
    """Benchmark algorithm performance with different input sizes."""
    data = request.get_json()
    input_sizes = data.get('input_sizes', [10, 50, 100, 500, 1000])
    
    def generate_graph_input(size):
        """Generate random graph of given size."""
        G = nx.gnp_random_graph(size, 0.2)
        nodes = [{'id': str(i)} for i in range(size)]
        edges = [
            {
                'source': str(u),
                'target': str(v),
                'weight': 1
            }
            for u, v in G.edges()
        ]
        return [G, '0', str(size-1)]  # For pathfinding algorithms
    
    def generate_dp_input(size):
        """Generate random input for dynamic programming."""
        if algorithm == 'knapsack':
            weights = np.random.randint(1, 100, size=size).tolist()
            values = np.random.randint(1, 100, size=size).tolist()
            capacity = int(sum(weights) * 0.3)
            return [weights, values, capacity]
        elif algorithm == 'lcs':
            str1 = ''.join(np.random.choice(list('ACGT'), size=size))
            str2 = ''.join(np.random.choice(list('ACGT'), size=size))
            return [str1, str2]
        else:  # matrix-chain
            dimensions = np.random.randint(1, 100, size=size+1).tolist()
            return [dimensions]
    
    # Select appropriate input generator and function
    if algorithm in ['dfs', 'bfs', 'dijkstra', 'astar']:
        generate_input = generate_graph_input
        if algorithm == 'dfs':
            func = graph_traversal.dfs
        elif algorithm == 'bfs':
            func = graph_traversal.bfs
        elif algorithm == 'dijkstra':
            func = graph_traversal.dijkstra
        else:
            func = graph_traversal.astar
    else:
        generate_input = generate_dp_input
        if algorithm == 'knapsack':
            func = dynamic_programming.knapsack
        elif algorithm == 'lcs':
            func = dynamic_programming.lcs
        else:
            func = dynamic_programming.matrix_chain
    
    # Run benchmarks
    results = analyze_complexity(func, input_sizes, generate_input)
    
    # Estimate complexity
    estimated_complexity = estimate_complexity(
        results['execution_times'],
        results['input_sizes']
    )
    
    return jsonify({
        'input_sizes': results['input_sizes'],
        'execution_times': results['execution_times'],
        'memory_usage': results['memory_usage'],
        'estimated_complexity': estimated_complexity
    }) 