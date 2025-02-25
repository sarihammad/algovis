from typing import Dict, List, Optional, Any
import networkx as nx

def create_step(
    graph: nx.Graph,
    visited: List[str],
    current: str,
    next_node: Optional[str] = None,
    distances: Optional[Dict[str, float]] = None,
    path: Optional[List[str]] = None,
    message: str = ""
) -> Dict[str, Any]:
    """
    Creates a visualization step with the current state of the algorithm.
    
    Args:
        graph: NetworkX graph object
        visited: List of visited nodes
        current: Current node being processed
        next_node: Next node to be processed (optional)
        distances: Dictionary of distances from start node (optional)
        path: List of nodes in the current path (optional)
        message: Description of the current step
        
    Returns:
        Dictionary containing the step information
    """
    nodes = []
    edges = []
    
    # Process nodes
    for node in graph.nodes():
        node_data = {
            'id': str(node),
            'value': graph.nodes[node].get('value', 1),
            'state': 'unvisited'
        }
        
        if node in visited:
            node_data['state'] = 'visited'
        if node == current:
            node_data['state'] = 'current'
        if next_node and node == next_node:
            node_data['state'] = 'next'
            
        if distances:
            node_data['distance'] = distances[node]
            
        if path and node in path:
            node_data['state'] = 'path'
            
        nodes.append(node_data)
    
    # Process edges
    for source, target in graph.edges():
        edge_data = {
            'source': str(source),
            'target': str(target),
            'weight': graph[source][target].get('weight', 1),
            'state': 'normal'
        }
        
        if path and source in path and target in path:
            # Check if these nodes are adjacent in the path
            source_idx = path.index(source)
            target_idx = path.index(target)
            if abs(source_idx - target_idx) == 1:
                edge_data['state'] = 'path'
                
        edges.append(edge_data)
    
    return {
        'nodes': nodes,
        'edges': edges,
        'visited': visited,
        'current': current,
        'next': next_node,
        'distances': distances,
        'path': path,
        'message': message
    }

def create_sample_graph() -> nx.Graph:
    """
    Creates a sample graph for testing and demonstration.
    
    Returns:
        NetworkX graph object
    """
    G = nx.Graph()
    
    # Add nodes
    nodes = ['A', 'B', 'C', 'D', 'E', 'F']
    G.add_nodes_from(nodes)
    
    # Add edges with weights
    edges = [
        ('A', 'B', 4),
        ('A', 'C', 2),
        ('B', 'C', 1),
        ('B', 'D', 5),
        ('C', 'D', 8),
        ('C', 'E', 10),
        ('D', 'E', 2),
        ('D', 'F', 6),
        ('E', 'F', 3)
    ]
    
    for source, target, weight in edges:
        G.add_edge(source, target, weight=weight)
    
    return G 