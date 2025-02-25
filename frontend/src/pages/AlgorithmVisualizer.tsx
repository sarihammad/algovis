import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  Slider,
  Stack,
  Typography,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  SkipNext,
  SkipPrevious,
  Refresh,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  setCurrentAlgorithm,
  setCurrentStep,
  nextStep,
  previousStep,
  setIsRunning,
  setExecutionSteps,
} from '../store/slices/algorithmSlice';
import GraphVisualizer from '../components/GraphVisualizer';
import MatrixVisualizer from '../components/MatrixVisualizer';
import AlgorithmInfo from '../components/AlgorithmInfo';
import { graphApi, dpApi, optimizationApi } from '../services/api';
import OptimizationVisualizer from '../components/OptimizationVisualizer';

const AlgorithmVisualizer = () => {
  const { algorithm } = useParams<{ algorithm: string }>();
  const dispatch = useDispatch();
  const [speed, setSpeed] = useState<number>(1);
  const [autoPlayInterval, setAutoPlayInterval] =
    useState<NodeJS.Timeout | null>(null);

  const { currentStep, executionSteps, isRunning, error } = useSelector(
    (state: RootState) => state.algorithm
  );

  useEffect(() => {
    if (algorithm) {
      dispatch(setCurrentAlgorithm(algorithm));
      loadInitialData();
    }
  }, [algorithm, dispatch]);

  const loadInitialData = async () => {
    try {
      if (
        algorithm?.includes('dfs') ||
        algorithm?.includes('bfs') ||
        algorithm?.includes('dijkstra')
      ) {
        const graph = await graphApi.getSampleGraph();
        const steps = await graphApi.traverseGraph(algorithm, graph, 'A', 'F');
        dispatch(setExecutionSteps(steps));
      } else if (algorithm?.includes('knapsack')) {
        const steps = await dpApi.solveKnapsack({
          weights: [2, 3, 4, 5],
          values: [3, 4, 5, 6],
          capacity: 10,
        });
        dispatch(setExecutionSteps(steps));
      } else if (algorithm?.includes('lcs')) {
        const steps = await dpApi.solveLCS({
          str1: 'ABCDGH',
          str2: 'AEDFHR',
        });
        dispatch(setExecutionSteps(steps));
      } else if (algorithm?.includes('matrix-chain')) {
        const steps = await dpApi.solveMatrixChain({
          dimensions: [30, 35, 15, 5, 10, 20, 25],
        });
        dispatch(setExecutionSteps(steps));
      } else if (algorithm?.includes('gradient-descent')) {
        const steps = await optimizationApi.solveGradientDescent({
          initial_point: [2.0, 2.0],
          learning_rate: 0.1,
          max_iterations: 100,
        });
        dispatch(setExecutionSteps(steps));
      } else if (algorithm?.includes('constrained')) {
        const steps = await optimizationApi.solveConstrained({
          initial_point: [2.0, 2.0],
          constraints: [
            {
              type: 'ineq',
              fun: 'lambda x: 1 - x[0] - x[1]', // x + y <= 1
            },
          ],
        });
        dispatch(setExecutionSteps(steps));
      }
    } catch (err) {
      console.error('Error loading algorithm data:', err);
    }
  };

  const handlePlayPause = () => {
    if (isRunning) {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        setAutoPlayInterval(null);
      }
      dispatch(setIsRunning(false));
    } else {
      const interval = setInterval(() => {
        dispatch(nextStep());
      }, 1000 / speed);
      setAutoPlayInterval(interval);
      dispatch(setIsRunning(true));
    }
  };

  const handleReset = () => {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      setAutoPlayInterval(null);
    }
    dispatch(setIsRunning(false));
    dispatch(setCurrentStep(0));
  };

  const handleSpeedChange = (_event: Event, newValue: number | number[]) => {
    setSpeed(newValue as number);
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      const interval = setInterval(() => {
        dispatch(nextStep());
      }, 1000 / (newValue as number));
      setAutoPlayInterval(interval);
    }
  };

  const renderVisualization = () => {
    if (!executionSteps[currentStep]) return null;

    const step = executionSteps[currentStep];

    if (step.type === 'graph') {
      return (
        <GraphVisualizer
          nodes={step.nodes}
          edges={step.edges}
          width={800}
          height={600}
        />
      );
    } else if (['knapsack', 'lcs', 'matrix-chain'].includes(step.type)) {
      return (
        <MatrixVisualizer
          data={step.dp_table}
          highlightCells={[
            {
              row: step.current_i || 0,
              col: step.current_j || 0,
            },
          ]}
          rowLabels={step.row_labels}
          colLabels={step.col_labels}
        />
      );
    } else if (['nonlinear', 'constrained'].includes(step.type)) {
      return (
        <OptimizationVisualizer
          data={step}
          width={800}
          height={600}
          showGradient={step.type === 'nonlinear'}
        />
      );
    }

    return null;
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {algorithm?.toUpperCase()} Visualization
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              width: '100%',
              height: 600,
              overflow: 'hidden',
              bgcolor: 'background.paper',
            }}
          >
            {renderVisualization()}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={2}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Controls
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <Button
                    variant="contained"
                    onClick={() => dispatch(previousStep())}
                    disabled={currentStep <= 0}
                  >
                    <SkipPrevious />
                  </Button>
                  <Button variant="contained" onClick={handlePlayPause}>
                    {isRunning ? <Pause /> : <PlayArrow />}
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => dispatch(nextStep())}
                    disabled={currentStep >= executionSteps.length - 1}
                  >
                    <SkipNext />
                  </Button>
                  <Button variant="contained" onClick={handleReset}>
                    <Refresh />
                  </Button>
                </Stack>

                <Typography gutterBottom>Speed</Typography>
                <Slider
                  value={speed}
                  onChange={handleSpeedChange}
                  min={0.5}
                  max={3}
                  step={0.5}
                  marks
                  valueLabelDisplay="auto"
                />
              </CardContent>
            </Card>

            {executionSteps[currentStep] && (
              <AlgorithmInfo
                algorithm={algorithm || ''}
                description=""
                timeComplexity=""
                spaceComplexity=""
                currentStep={currentStep}
                totalSteps={executionSteps.length}
                message={executionSteps[currentStep].message}
                additionalInfo={executionSteps[currentStep].distances}
              />
            )}

            {error && (
              <Card>
                <CardContent>
                  <Typography color="error">{error}</Typography>
                </CardContent>
              </Card>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AlgorithmVisualizer;
