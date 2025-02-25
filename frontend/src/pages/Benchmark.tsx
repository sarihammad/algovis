import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Speed as SpeedIcon } from '@mui/icons-material';
import axios from 'axios';
import PerformanceVisualizer from '../components/PerformanceVisualizer';

interface BenchmarkData {
  input_sizes: number[];
  execution_times: number[];
  memory_usage: number[];
  estimated_complexity: string;
}

const Benchmark = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('');
  const [inputSizes, setInputSizes] = useState('10,20,50,100,200,500');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [benchmarkData, setBenchmarkData] = useState<BenchmarkData | null>(
    null
  );

  const algorithms = [
    { value: 'dfs', label: 'Depth-First Search' },
    { value: 'bfs', label: 'Breadth-First Search' },
    { value: 'dijkstra', label: "Dijkstra's Algorithm" },
    { value: 'astar', label: 'A* Search' },
    { value: 'knapsack', label: '0/1 Knapsack' },
    { value: 'lcs', label: 'Longest Common Subsequence' },
    { value: 'matrix-chain', label: 'Matrix Chain Multiplication' },
  ];

  const handleRunBenchmark = async () => {
    try {
      setLoading(true);
      setError(null);

      const sizes = inputSizes.split(',').map((s) => parseInt(s.trim(), 10));
      if (sizes.some((s) => isNaN(s) || s <= 0)) {
        throw new Error(
          'Invalid input sizes. Please enter positive numbers separated by commas.'
        );
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/benchmark/${selectedAlgorithm}`,
        {
          input_sizes: sizes,
        }
      );

      setBenchmarkData(response.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while running the benchmark.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <SpeedIcon sx={{ fontSize: 40 }} />
          Performance Benchmarks
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Analyze algorithm performance across different input sizes and compare
          their time and space complexity.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Benchmark Configuration
            </Typography>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Algorithm</InputLabel>
              <Select
                value={selectedAlgorithm}
                label="Algorithm"
                onChange={(e) => setSelectedAlgorithm(e.target.value)}
              >
                {algorithms.map((algo) => (
                  <MenuItem key={algo.value} value={algo.value}>
                    {algo.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Input Sizes"
              value={inputSizes}
              onChange={(e) => setInputSizes(e.target.value)}
              helperText="Enter comma-separated numbers (e.g., 10,20,50,100)"
              sx={{ mb: 2 }}
            />

            <Button
              variant="contained"
              fullWidth
              onClick={handleRunBenchmark}
              disabled={!selectedAlgorithm || loading}
              startIcon={
                loading ? <CircularProgress size={20} /> : <SpeedIcon />
              }
            >
              Run Benchmark
            </Button>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          {benchmarkData ? (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Results
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Estimated Complexity: {benchmarkData.estimated_complexity}
              </Typography>

              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Execution Time Analysis
                </Typography>
                <PerformanceVisualizer
                  data={{
                    input_sizes: benchmarkData.input_sizes,
                    execution_times: benchmarkData.execution_times,
                    memory_usage: benchmarkData.memory_usage,
                    estimated_complexity: benchmarkData.estimated_complexity,
                  }}
                  width={700}
                  height={300}
                />
              </Box>

              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Memory Usage Analysis
                </Typography>
                <PerformanceVisualizer
                  data={{
                    input_sizes: benchmarkData.input_sizes,
                    execution_times: benchmarkData.memory_usage,
                    memory_usage: benchmarkData.memory_usage,
                    estimated_complexity: benchmarkData.estimated_complexity,
                  }}
                  width={700}
                  height={300}
                />
              </Box>
            </Paper>
          ) : (
            <Paper
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="body1" color="text.secondary">
                Select an algorithm and run the benchmark to see performance
                analysis.
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Benchmark;
