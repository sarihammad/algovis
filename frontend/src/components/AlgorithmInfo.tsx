import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';

interface AlgorithmInfoProps {
  algorithm: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  currentStep: number;
  totalSteps: number;
  message: string;
  additionalInfo?: Record<string, string | number>;
}

const complexityMap: Record<string, { time: string; space: string }> = {
  dfs: {
    time: 'O(V + E)',
    space: 'O(V)',
  },
  bfs: {
    time: 'O(V + E)',
    space: 'O(V)',
  },
  dijkstra: {
    time: 'O((V + E) log V)',
    space: 'O(V)',
  },
  astar: {
    time: 'O((V + E) log V)',
    space: 'O(V)',
  },
  knapsack: {
    time: 'O(nW)',
    space: 'O(nW)',
  },
  lcs: {
    time: 'O(mn)',
    space: 'O(mn)',
  },
  'matrix-chain': {
    time: 'O(n³)',
    space: 'O(n²)',
  },
  'linear-programming': {
    time: 'O(n²m)',
    space: 'O(nm)',
  },
  'max-flow': {
    time: 'O(VE²)',
    space: 'O(V + E)',
  },
  'min-cost-flow': {
    time: 'O(V²E)',
    space: 'O(V + E)',
  },
  'bellman-ford': {
    time: 'O(VE)',
    space: 'O(V)',
  },
  'floyd-warshall': {
    time: 'O(V³)',
    space: 'O(V²)',
  },
};

const descriptions: Record<string, string> = {
  dfs: 'Depth-First Search explores a graph by going as deep as possible along each branch before backtracking. It uses a stack (or recursion) to keep track of nodes to visit, making it memory efficient for deep graphs.',
  bfs: 'Breadth-First Search explores a graph by visiting all vertices at the current depth before moving to vertices at the next depth level. It uses a queue to track nodes and guarantees the shortest path in unweighted graphs.',
  dijkstra:
    "Dijkstra's algorithm finds the shortest path between nodes in a graph with non-negative edge weights. It uses a priority queue to always process the node with the smallest tentative distance, making it optimal for single-source shortest paths.",
  astar:
    "A* search algorithm finds the shortest path using heuristics to guide its search. It combines Dijkstra's algorithm with heuristic estimation of the remaining distance, making it more efficient for targeted pathfinding.",
  knapsack:
    '0/1 Knapsack solves the problem of choosing items with given weights and values to maximize total value while staying within a weight constraint. It uses dynamic programming to build solutions from smaller subproblems.',
  lcs: 'Longest Common Subsequence finds the longest subsequence present in both given sequences. The algorithm uses dynamic programming to compare all possible character combinations and build the solution incrementally.',
  'matrix-chain':
    'Matrix Chain Multiplication finds the most efficient way to multiply a sequence of matrices. It uses dynamic programming to try all possible ways of parenthesizing the matrix multiplication sequence.',
  'linear-programming':
    'Linear Programming solves optimization problems with linear objective functions subject to linear constraints. The Simplex algorithm iteratively improves a feasible solution by moving along vertices of the feasible region.',
  'max-flow':
    'Maximum Flow determines the maximum flow possible from source to sink in a flow network. The Ford-Fulkerson algorithm repeatedly finds augmenting paths and increases flow until no more paths are available.',
  'min-cost-flow':
    'Minimum Cost Flow finds the cheapest possible way to send a certain amount of flow through a flow network. The Successive Shortest Path algorithm iteratively finds the cheapest paths to send flow.',
  'bellman-ford':
    "Bellman-Ford algorithm finds shortest paths from a source vertex to all other vertices, even with negative edge weights. It can detect negative cycles and is more versatile than Dijkstra's algorithm.",
  'floyd-warshall':
    'Floyd-Warshall algorithm finds shortest paths between all pairs of vertices in a weighted graph. It works with both positive and negative edge weights, but cannot handle negative cycles.',
};

const AlgorithmInfo = ({
  algorithm,
  description = descriptions[algorithm] || 'No description available.',
  timeComplexity = complexityMap[algorithm]?.time || 'N/A',
  spaceComplexity = complexityMap[algorithm]?.space || 'N/A',
  currentStep,
  totalSteps,
  message,
  additionalInfo = {},
}: AlgorithmInfoProps) => {
  return (
    <Box>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {algorithm.toUpperCase()}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {description}
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText
                primary="Time Complexity"
                secondary={timeComplexity}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Space Complexity"
                secondary={spaceComplexity}
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Execution Progress
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Step {currentStep + 1} of {totalSteps}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {message}
          </Typography>

          {Object.keys(additionalInfo).length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom>
                Additional Information
              </Typography>
              <List dense>
                {Object.entries(additionalInfo).map(([key, value]) => (
                  <ListItem key={key}>
                    <ListItemText
                      primary={key.replace(/([A-Z])/g, ' $1').trim()}
                      secondary={value.toString()}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AlgorithmInfo;
