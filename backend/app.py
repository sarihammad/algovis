from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os
import traceback
from algorithms.graph_traversal import dfs, bfs, dijkstra, astar
from algorithms.dynamic_programming import knapsack, lcs, matrix_chain
from algorithms.optimization import (
    simplex,
    max_flow,
    min_cost_flow,
    gradient_descent,
    constrained_optimization
)
from algorithms.utils import create_sample_graph
from utils.benchmarking import analyze_complexity, estimate_complexity

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Error handling
@app.errorhandler(Exception)
def handle_error(error):
    return jsonify({
        'error': str(error),
        'traceback': traceback.format_exc()
    }), 500

# Basic health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'AlgoVis API is running'})

# Algorithm categories endpoints
@app.route('/api/algorithms', methods=['GET'])
def get_algorithm_categories():
    categories = {
        'graph_traversal': ['dfs', 'bfs', 'dijkstra', 'astar'],
        'dynamic_programming': ['knapsack', 'lcs', 'matrix_chain'],
        'optimization': ['linear_programming', 'min_cost_flow', 'max_flow', 'gradient_descent', 'constrained'],
        'shortest_paths': ['bellman_ford', 'floyd_warshall']
    }
    return jsonify(categories)

# Graph traversal endpoints
@app.route('/api/graph/sample', methods=['GET'])
def get_sample_graph():
    graph = create_sample_graph()
    return jsonify({
        'nodes': [{'id': n} for n in graph.nodes()],
        'edges': [{'source': u, 'target': v, 'weight': d['weight']} 
                 for u, v, d in graph.edges(data=True)]
    })

@app.route('/api/graph/traverse/<algorithm>', methods=['POST'])
def traverse_graph(algorithm):
    try:
        data = request.get_json()
        graph = create_sample_graph()  # For now, using sample graph
        start = data.get('start', 'A')
        end = data.get('end')
        
        if algorithm == 'dfs':
            steps = dfs(graph, start)
        elif algorithm == 'bfs':
            steps = bfs(graph, start)
        elif algorithm == 'dijkstra':
            if not end:
                return jsonify({'error': 'End node required for Dijkstra\'s algorithm'}), 400
            steps = dijkstra(graph, start, end)
        elif algorithm == 'astar':
            if not end:
                return jsonify({'error': 'End node required for A* algorithm'}), 400
            def heuristic(n1, n2):
                # Manhattan distance for demonstration
                pos1 = graph.nodes[n1].get('pos', (0, 0))
                pos2 = graph.nodes[n2].get('pos', (0, 0))
                return abs(pos1[0] - pos2[0]) + abs(pos1[1] - pos2[1])
            steps = astar(graph, start, end, heuristic)
        else:
            return jsonify({'error': f'Unknown algorithm: {algorithm}'}), 400
            
        return jsonify({'steps': steps})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Dynamic programming endpoints
@app.route('/api/dp/knapsack', methods=['POST'])
def solve_knapsack():
    try:
        data = request.get_json()
        weights = data.get('weights', [2, 3, 4, 5])
        values = data.get('values', [3, 4, 5, 6])
        capacity = data.get('capacity', 10)
        
        steps = knapsack(weights, values, capacity)
        return jsonify({'steps': steps})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/dp/lcs', methods=['POST'])
def solve_lcs():
    try:
        data = request.get_json()
        str1 = data.get('str1', 'ABCDGH')
        str2 = data.get('str2', 'AEDFHR')
        
        steps = lcs(str1, str2)
        return jsonify({'steps': steps})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/dp/matrix-chain', methods=['POST'])
def solve_matrix_chain():
    try:
        data = request.get_json()
        dimensions = data.get('dimensions', [30, 35, 15, 5, 10, 20, 25])
        
        steps = matrix_chain(dimensions)
        return jsonify({'steps': steps})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Optimization endpoints
@app.route('/api/optimization/simplex', methods=['POST'])
def solve_simplex():
    try:
        data = request.get_json()
        c = data.get('objective')
        A = data.get('constraints')
        b = data.get('bounds')
        maximize = data.get('maximize', True)
        
        steps = simplex(c, A, b, maximize)
        return jsonify({'steps': steps})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/optimization/max-flow', methods=['POST'])
def solve_max_flow():
    try:
        data = request.get_json()
        graph = create_sample_graph()  # Convert input graph to NetworkX
        source = data.get('source', 'A')
        sink = data.get('sink', 'F')
        
        steps = max_flow(graph, source, sink)
        return jsonify({'steps': steps})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/optimization/min-cost-flow', methods=['POST'])
def solve_min_cost_flow():
    try:
        data = request.get_json()
        graph = create_sample_graph()  # Convert input graph to NetworkX
        source = data.get('source', 'A')
        sink = data.get('sink', 'F')
        demand = data.get('demand', 5)
        
        steps = min_cost_flow(graph, source, sink, demand)
        return jsonify({'steps': steps})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/optimization/gradient-descent', methods=['POST'])
def solve_gradient_descent():
    try:
        data = request.get_json()
        initial_point = data.get('initial_point', [2.0, 2.0])
        learning_rate = data.get('learning_rate', 0.1)
        max_iterations = data.get('max_iterations', 100)
        
        def objective_fn(x):
            return x[0]**2 + x[1]**2  # Example quadratic function
            
        def gradient_fn(x):
            return [2*x[0], 2*x[1]]  # Gradient of the quadratic function
            
        steps = gradient_descent(objective_fn, gradient_fn, initial_point,
                               learning_rate, max_iterations)
        return jsonify({'steps': steps})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/optimization/constrained', methods=['POST'])
def solve_constrained():
    try:
        data = request.get_json()
        initial_point = data.get('initial_point', [2.0, 2.0])
        constraints = data.get('constraints', [])
        method = data.get('method', 'SLSQP')
        
        def objective_fn(x):
            return x[0]**2 + x[1]**2  # Example quadratic function
            
        steps = constrained_optimization(objective_fn, constraints,
                                      initial_point, method)
        return jsonify({'steps': steps})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Benchmarking endpoint
@app.route('/api/benchmark/<algorithm>', methods=['POST'])
def benchmark_algorithm(algorithm):
    try:
        data = request.get_json()
        input_sizes = data.get('input_sizes', [10, 20, 50, 100, 200, 500])
        
        def generate_input(size):
            if algorithm in ['dfs', 'bfs', 'dijkstra', 'astar']:
                graph = create_sample_graph()  # Create graph of given size
                return (graph, 'A', 'F')
            elif algorithm == 'knapsack':
                return ([2]*size, [3]*size, size*2)
            elif algorithm == 'lcs':
                return ('A'*size, 'B'*size)
            elif algorithm == 'matrix-chain':
                return ([10]*(size+1),)
            else:
                raise ValueError(f'Unknown algorithm: {algorithm}')
        
        # Get the appropriate function based on algorithm
        func = globals().get(algorithm)
        if not func:
            return jsonify({'error': f'Unknown algorithm: {algorithm}'}), 400
            
        # Analyze complexity
        results = analyze_complexity(func, input_sizes, generate_input)
        
        # Estimate complexity class
        estimated_complexity = estimate_complexity(
            results['execution_times'],
            results['input_sizes']
        )
        
        results['estimated_complexity'] = estimated_complexity
        return jsonify(results)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True) 