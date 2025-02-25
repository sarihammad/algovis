import time
import tracemalloc
from typing import Any, Callable, Dict, List, Tuple
from functools import wraps

def measure_performance(func: Callable) -> Callable:
    """
    Decorator to measure execution time and memory usage of algorithms.
    """
    @wraps(func)
    def wrapper(*args, **kwargs) -> Tuple[List[Dict], Dict[str, Any]]:
        # Start memory tracking
        tracemalloc.start()
        start_memory = tracemalloc.get_traced_memory()[0]
        
        # Measure execution time
        start_time = time.perf_counter()
        result = func(*args, **kwargs)
        execution_time = time.perf_counter() - start_time
        
        # Get memory usage
        current_memory, peak_memory = tracemalloc.get_traced_memory()
        memory_increase = current_memory - start_memory
        tracemalloc.stop()
        
        # Add performance metrics to the result
        metrics = {
            'execution_time': execution_time,
            'memory_usage': memory_increase,
            'peak_memory': peak_memory,
        }
        
        return result, metrics
    
    return wrapper

def analyze_complexity(
    func: Callable,
    input_sizes: List[int],
    generate_input: Callable[[int], Tuple]
) -> Dict[str, List[float]]:
    """
    Analyze algorithm complexity by measuring performance across different input sizes.
    
    Args:
        func: Algorithm function to analyze
        input_sizes: List of input sizes to test
        generate_input: Function to generate input data of given size
        
    Returns:
        Dictionary containing execution times and memory usage for each input size
    """
    results = {
        'input_sizes': input_sizes,
        'execution_times': [],
        'memory_usage': [],
    }
    
    for size in input_sizes:
        # Generate input data
        args = generate_input(size)
        
        # Measure performance
        _, metrics = measure_performance(func)(*args)
        
        results['execution_times'].append(metrics['execution_time'])
        results['memory_usage'].append(metrics['memory_usage'])
    
    return results

def estimate_complexity(times: List[float], sizes: List[int]) -> str:
    """
    Estimate the time complexity based on measured execution times.
    
    Args:
        times: List of execution times
        sizes: List of corresponding input sizes
        
    Returns:
        String describing the estimated complexity
    """
    import numpy as np
    from scipy.optimize import curve_fit
    
    def constant(n, a):
        return a * np.ones_like(n)
    
    def linear(n, a):
        return a * n
    
    def log(n, a):
        return a * np.log(n)
    
    def nlogn(n, a):
        return a * n * np.log(n)
    
    def quadratic(n, a):
        return a * n**2
    
    def cubic(n, a):
        return a * n**3
    
    def exponential(n, a):
        return a * 2**n
    
    # Functions to test against
    functions = [
        (constant, 'O(1)'),
        (linear, 'O(n)'),
        (log, 'O(log n)'),
        (nlogn, 'O(n log n)'),
        (quadratic, 'O(n²)'),
        (cubic, 'O(n³)'),
        (exponential, 'O(2ⁿ)'),
    ]
    
    best_error = float('inf')
    best_complexity = 'Unknown'
    
    x = np.array(sizes)
    y = np.array(times)
    
    for func, complexity in functions:
        try:
            popt, _ = curve_fit(func, x, y)
            y_pred = func(x, *popt)
            error = np.mean((y - y_pred)**2)
            
            if error < best_error:
                best_error = error
                best_complexity = complexity
        except:
            continue
    
    return best_complexity 