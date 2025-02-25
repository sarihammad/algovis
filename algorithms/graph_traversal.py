from typing import Dict, List, Set, Tuple, Callable
from collections import deque
import heapq
import networkx as nx
from .utils import create_step

def dfs(graph: nx.Graph, start: str) -> List[Dict]:
    """
    Depth-First Search implementation that returns visualization steps.
    
    Args:
        graph: NetworkX graph object
        start: Starting node
        
    Returns:
        List of steps for visualization
    """
    visited: Set[str] = set()
    steps: List[Dict] = []
    
    def dfs_recursive(node: str) -> None:
        visited.add(node)
        steps.append(create_step(
            graph,
            visited=list(visited),
            current=node,
            message=f"Visiting node {node}"
        ))
        
        for neighbor in graph.neighbors(node):
            if neighbor not in visited:
                steps.append(create_step(
                    graph,
                    visited=list(visited),
                    current=node,
                    next_node=neighbor,
                    message=f"Exploring edge {node} -> {neighbor}"
                ))
                dfs_recursive(neighbor)
    
    steps.append(create_step(
        graph,
        visited=[],
        current=start,
        message=f"Starting DFS from node {start}"
    ))
    dfs_recursive(start)
    return steps

def bfs(graph: nx.Graph, start: str) -> List[Dict]:
    """
    Breadth-First Search implementation that returns visualization steps.
    
    Args:
        graph: NetworkX graph object
        start: Starting node
        
    Returns:
        List of steps for visualization
    """
    visited: Set[str] = set()
    queue: deque = deque([start])
    steps: List[Dict] = []
    
    steps.append(create_step(
        graph,
        visited=[],
        current=start,
        message=f"Starting BFS from node {start}"
    ))
    
    while queue:
        node = queue.popleft()
        if node not in visited:
            visited.add(node)
            steps.append(create_step(
                graph,
                visited=list(visited),
                current=node,
                message=f"Visiting node {node}"
            ))
            
            for neighbor in graph.neighbors(node):
                if neighbor not in visited:
                    queue.append(neighbor)
                    steps.append(create_step(
                        graph,
                        visited=list(visited),
                        current=node,
                        next_node=neighbor,
                        message=f"Adding {neighbor} to queue"
                    ))
    
    return steps

def dijkstra(graph: nx.Graph, start: str, end: str) -> List[Dict]:
    """
    Dijkstra's shortest path algorithm implementation that returns visualization steps.
    
    Args:
        graph: NetworkX graph object
        start: Starting node
        end: Target node
        
    Returns:
        List of steps for visualization
    """
    distances: Dict[str, float] = {node: float('infinity') for node in graph.nodes()}
    distances[start] = 0
    visited: Set[str] = set()
    previous: Dict[str, str] = {}
    steps: List[Dict] = []
    
    steps.append(create_step(
        graph,
        visited=[],
        current=start,
        distances=distances,
        message=f"Starting Dijkstra's algorithm from node {start}"
    ))
    
    while len(visited) < len(graph.nodes()):
        # Find unvisited node with minimum distance
        min_distance = float('infinity')
        current_node = None
        
        for node in graph.nodes():
            if node not in visited and distances[node] < min_distance:
                min_distance = distances[node]
                current_node = node
        
        if current_node is None or distances[current_node] == float('infinity'):
            break
            
        visited.add(current_node)
        steps.append(create_step(
            graph,
            visited=list(visited),
            current=current_node,
            distances=distances,
            message=f"Processing node {current_node}"
        ))
        
        # Update distances to neighbors
        for neighbor in graph.neighbors(current_node):
            if neighbor not in visited:
                weight = graph[current_node][neighbor].get('weight', 1)
                new_distance = distances[current_node] + weight
                
                if new_distance < distances[neighbor]:
                    distances[neighbor] = new_distance
                    previous[neighbor] = current_node
                    steps.append(create_step(
                        graph,
                        visited=list(visited),
                        current=current_node,
                        next_node=neighbor,
                        distances=distances,
                        message=f"Updated distance to {neighbor}: {new_distance}"
                    ))
        
        if current_node == end:
            # Reconstruct path
            path = []
            current = end
            while current in previous:
                path.append(current)
                current = previous[current]
            path.append(start)
            path.reverse()
            
            steps.append(create_step(
                graph,
                visited=list(visited),
                path=path,
                distances=distances,
                message=f"Found shortest path: {' -> '.join(path)}"
            ))
            break
    
    return steps 

def astar(
    graph: nx.Graph,
    start: str,
    end: str,
    heuristic_fn: Callable[[str, str], float] = None
) -> List[Dict]:
    """
    A* pathfinding algorithm implementation that returns visualization steps.
    
    Args:
        graph: NetworkX graph object
        start: Starting node
        end: Target node
        heuristic_fn: Function to estimate distance to goal (defaults to Euclidean distance)
        
    Returns:
        List of steps for visualization
    """
    if heuristic_fn is None:
        # Default to Euclidean distance if coordinates are available
        def heuristic_fn(node1: str, node2: str) -> float:
            pos1 = graph.nodes[node1].get('pos', (0, 0))
            pos2 = graph.nodes[node2].get('pos', (0, 0))
            return ((pos1[0] - pos2[0]) ** 2 + (pos1[1] - pos2[1]) ** 2) ** 0.5
    
    steps: List[Dict] = []
    
    # Priority queue entries are (f_score, node)
    open_set = [(0 + heuristic_fn(start, end), start)]
    heapq.heapify(open_set)
    
    # For node n, g_score[n] is the cost of the cheapest path from start to n currently known
    g_score = {node: float('infinity') for node in graph.nodes()}
    g_score[start] = 0
    
    # For node n, f_score[n] = g_score[n] + h(n)
    f_score = {node: float('infinity') for node in graph.nodes()}
    f_score[start] = heuristic_fn(start, end)
    
    # For node n, came_from[n] is the node immediately preceding it on the cheapest path from start
    came_from = {}
    
    visited = set()
    
    steps.append(create_step(
        graph,
        visited=list(visited),
        current=start,
        distances=g_score,
        message=f"Starting A* search from {start} to {end}"
    ))
    
    while open_set:
        current_f, current = heapq.heappop(open_set)
        
        if current == end:
            # Reconstruct path
            path = []
            while current in came_from:
                path.append(current)
                current = came_from[current]
            path.append(start)
            path.reverse()
            
            steps.append(create_step(
                graph,
                visited=list(visited),
                path=path,
                distances=g_score,
                message=f"Found path: {' -> '.join(path)}"
            ))
            break
        
        visited.add(current)
        steps.append(create_step(
            graph,
            visited=list(visited),
            current=current,
            distances=g_score,
            message=f"Exploring node {current}"
        ))
        
        for neighbor in graph.neighbors(current):
            if neighbor in visited:
                continue
                
            # tentative_g_score is the distance from start to neighbor through current
            tentative_g_score = g_score[current] + graph[current][neighbor].get('weight', 1)
            
            if tentative_g_score < g_score[neighbor]:
                # This path to neighbor is better than any previous one
                came_from[neighbor] = current
                g_score[neighbor] = tentative_g_score
                f_score[neighbor] = g_score[neighbor] + heuristic_fn(neighbor, end)
                
                steps.append(create_step(
                    graph,
                    visited=list(visited),
                    current=current,
                    next_node=neighbor,
                    distances=g_score,
                    message=f"Updated distance to {neighbor}: {tentative_g_score}"
                ))
                
                # Add neighbor to open set if not already there
                if not any(node == neighbor for _, node in open_set):
                    heapq.heappush(open_set, (f_score[neighbor], neighbor))
    
    if not any(node == end for _, node in open_set):
        steps.append(create_step(
            graph,
            visited=list(visited),
            distances=g_score,
            message=f"No path found from {start} to {end}"
        ))
    
    return steps 