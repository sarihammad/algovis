from typing import Dict, List, Tuple
import numpy as np

def knapsack(weights: List[int], values: List[int], capacity: int) -> List[Dict]:
    """
    0/1 Knapsack problem implementation that returns visualization steps.
    
    Args:
        weights: List of item weights
        values: List of item values
        capacity: Knapsack capacity
        
    Returns:
        List of steps for visualization
    """
    n = len(weights)
    dp = np.zeros((n + 1, capacity + 1), dtype=int)
    steps: List[Dict] = []
    
    # Initialize the visualization state
    steps.append({
        'type': 'knapsack',
        'dp_table': dp.tolist(),
        'current_item': None,
        'current_capacity': None,
        'selected_items': [],
        'message': 'Starting 0/1 Knapsack algorithm'
    })
    
    # Fill the dp table
    for i in range(1, n + 1):
        for w in range(capacity + 1):
            steps.append({
                'type': 'knapsack',
                'dp_table': dp.tolist(),
                'current_item': i - 1,
                'current_capacity': w,
                'selected_items': [],
                'message': f'Considering item {i} with weight {weights[i-1]} and value {values[i-1]} for capacity {w}'
            })
            
            if weights[i-1] <= w:
                dp[i][w] = max(values[i-1] + dp[i-1][w-weights[i-1]], dp[i-1][w])
            else:
                dp[i][w] = dp[i-1][w]
    
    # Backtrack to find selected items
    selected_items = []
    w = capacity
    for i in range(n, 0, -1):
        if dp[i][w] != dp[i-1][w]:
            selected_items.append(i-1)
            w -= weights[i-1]
            
            steps.append({
                'type': 'knapsack',
                'dp_table': dp.tolist(),
                'current_item': i - 1,
                'current_capacity': w,
                'selected_items': selected_items.copy(),
                'message': f'Selected item {i-1}'
            })
    
    # Add final step
    steps.append({
        'type': 'knapsack',
        'dp_table': dp.tolist(),
        'current_item': None,
        'current_capacity': None,
        'selected_items': selected_items,
        'message': f'Final solution: total value = {dp[n][capacity]}'
    })
    
    return steps

def lcs(str1: str, str2: str) -> List[Dict]:
    """
    Longest Common Subsequence implementation that returns visualization steps.
    
    Args:
        str1: First string
        str2: Second string
        
    Returns:
        List of steps for visualization
    """
    m, n = len(str1), len(str2)
    dp = np.zeros((m + 1, n + 1), dtype=int)
    steps: List[Dict] = []
    
    # Initialize the visualization state
    steps.append({
        'type': 'lcs',
        'dp_table': dp.tolist(),
        'str1': str1,
        'str2': str2,
        'current_i': None,
        'current_j': None,
        'lcs_chars': [],
        'message': 'Starting Longest Common Subsequence algorithm'
    })
    
    # Fill the dp table
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            steps.append({
                'type': 'lcs',
                'dp_table': dp.tolist(),
                'str1': str1,
                'str2': str2,
                'current_i': i - 1,
                'current_j': j - 1,
                'lcs_chars': [],
                'message': f'Comparing characters {str1[i-1]} and {str2[j-1]}'
            })
            
            if str1[i-1] == str2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    
    # Backtrack to find LCS
    lcs_chars = []
    i, j = m, n
    while i > 0 and j > 0:
        if str1[i-1] == str2[j-1]:
            lcs_chars.append(str1[i-1])
            i -= 1
            j -= 1
            steps.append({
                'type': 'lcs',
                'dp_table': dp.tolist(),
                'str1': str1,
                'str2': str2,
                'current_i': i,
                'current_j': j,
                'lcs_chars': lcs_chars.copy(),
                'message': f'Found matching character: {str1[i]}'
            })
        elif dp[i-1][j] > dp[i][j-1]:
            i -= 1
        else:
            j -= 1
    
    lcs_chars.reverse()
    
    # Add final step
    steps.append({
        'type': 'lcs',
        'dp_table': dp.tolist(),
        'str1': str1,
        'str2': str2,
        'current_i': None,
        'current_j': None,
        'lcs_chars': lcs_chars,
        'message': f'Found LCS: {"".join(lcs_chars)}'
    })
    
    return steps

def matrix_chain(dimensions: List[int]) -> List[Dict]:
    """
    Matrix Chain Multiplication implementation that returns visualization steps.
    
    Args:
        dimensions: List of matrix dimensions
        
    Returns:
        List of steps for visualization
    """
    n = len(dimensions) - 1
    dp = np.full((n, n), float('inf'))
    parenthesis = np.zeros((n, n), dtype=int)
    steps: List[Dict] = []
    
    # Initialize diagonal
    for i in range(n):
        dp[i][i] = 0
    
    steps.append({
        'type': 'matrix_chain',
        'dp_table': dp.tolist(),
        'parenthesis': parenthesis.tolist(),
        'current_len': None,
        'current_i': None,
        'current_j': None,
        'current_k': None,
        'message': 'Starting Matrix Chain Multiplication algorithm'
    })
    
    # Fill the dp table
    for chain_len in range(2, n + 1):
        for i in range(n - chain_len + 1):
            j = i + chain_len - 1
            
            steps.append({
                'type': 'matrix_chain',
                'dp_table': dp.tolist(),
                'parenthesis': parenthesis.tolist(),
                'current_len': chain_len,
                'current_i': i,
                'current_j': j,
                'current_k': None,
                'message': f'Computing optimal cost for matrices {i} to {j}'
            })
            
            for k in range(i, j):
                cost = (dp[i][k] + dp[k+1][j] +
                       dimensions[i] * dimensions[k+1] * dimensions[j+1])
                
                steps.append({
                    'type': 'matrix_chain',
                    'dp_table': dp.tolist(),
                    'parenthesis': parenthesis.tolist(),
                    'current_len': chain_len,
                    'current_i': i,
                    'current_j': j,
                    'current_k': k,
                    'message': f'Trying split at k={k}, cost={cost}'
                })
                
                if cost < dp[i][j]:
                    dp[i][j] = cost
                    parenthesis[i][j] = k
    
    # Add final step
    steps.append({
        'type': 'matrix_chain',
        'dp_table': dp.tolist(),
        'parenthesis': parenthesis.tolist(),
        'current_len': None,
        'current_i': None,
        'current_j': None,
        'current_k': None,
        'message': f'Minimum number of multiplications: {int(dp[0][n-1])}'
    })
    
    return steps 