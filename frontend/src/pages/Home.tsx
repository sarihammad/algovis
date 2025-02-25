import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  useTheme,
  Button,
  Container,
  Paper,
  Divider,
  Stack,
} from '@mui/material';
import {
  AccountTree,
  Functions,
  Timeline,
  Route,
  Speed,
  GitHub,
  Code,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const categories = [
    {
      title: 'Graph Traversal',
      description:
        "Explore algorithms like DFS, BFS, Dijkstra's, and A* to understand how graphs are traversed and shortest paths are found.",
      icon: <AccountTree sx={{ fontSize: 40 }} />,
      algorithms: [
        { name: 'DFS', path: 'dfs' },
        { name: 'BFS', path: 'bfs' },
        { name: 'Dijkstra', path: 'dijkstra' },
        { name: 'A*', path: 'astar' },
      ],
    },
    {
      title: 'Dynamic Programming',
      description:
        'Visualize how complex problems are broken down into simpler subproblems with algorithms like Knapsack, LCS, and Matrix Chain Multiplication.',
      icon: <Functions sx={{ fontSize: 40 }} />,
      algorithms: [
        { name: 'Knapsack', path: 'knapsack' },
        { name: 'LCS', path: 'lcs' },
        { name: 'Matrix Chain', path: 'matrix-chain' },
      ],
    },
    {
      title: 'Optimization',
      description:
        'Learn about Linear Programming, Min-Cost Flow, and Max-Flow algorithms used in real-world optimization problems.',
      icon: <Timeline sx={{ fontSize: 40 }} />,
      algorithms: [
        { name: 'Linear Programming', path: 'linear-programming' },
        { name: 'Min-Cost Flow', path: 'min-cost-flow' },
        { name: 'Max-Flow', path: 'max-flow' },
        { name: 'Gradient Descent', path: 'gradient-descent' },
        { name: 'Constrained', path: 'constrained' },
      ],
    },
    {
      title: 'Shortest Paths',
      description:
        'Understand how algorithms like Bellman-Ford and Floyd-Warshall find the shortest paths in different types of graphs.',
      icon: <Route sx={{ fontSize: 40 }} />,
      algorithms: [
        { name: 'Bellman-Ford', path: 'bellman-ford' },
        { name: 'Floyd-Warshall', path: 'floyd-warshall' },
      ],
    },
  ];

  const features = [
    {
      icon: <Speed sx={{ fontSize: 30 }} />,
      title: 'Performance Analysis',
      description:
        'Compare algorithm efficiency with built-in benchmarking tools and Big-O analysis.',
    },
    {
      icon: <Code sx={{ fontSize: 30 }} />,
      title: 'Interactive Visualization',
      description:
        'Step through algorithm execution with detailed state transitions and visual feedback.',
    },
    {
      icon: <GitHub sx={{ fontSize: 30 }} />,
      title: 'Open Source',
      description:
        'Contribute to the project and help improve algorithm visualization for everyone.',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'background.paper',
          color: 'text.primary',
          mb: 8,
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                component="h1"
                variant="h2"
                color="primary"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                AlgoVis
              </Typography>
              <Typography variant="h5" color="text.secondary" paragraph>
                An interactive platform for visualizing and understanding
                complex algorithms through step-by-step execution and dynamic
                visualizations.
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/visualizer/dfs')}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<GitHub />}
                  onClick={() =>
                    window.open(
                      'https://github.com/yourusername/algovis',
                      '_blank'
                    )
                  }
                >
                  View on GitHub
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/hero-image.svg"
                alt="Algorithm Visualization"
                sx={{
                  width: '100%',
                  maxHeight: 400,
                  objectFit: 'contain',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography
          variant="h4"
          align="center"
          color="text.primary"
          gutterBottom
          sx={{ mb: 4 }}
        >
          Key Features
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature) => (
            <Grid item xs={12} md={4} key={feature.title}>
              <Paper
                sx={{
                  p: 3,
                  height: '100%',
                  backgroundColor: 'background.paper',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.3s ease-in-out',
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                    color: 'primary.main',
                  }}
                >
                  {feature.icon}
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {feature.title}
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Algorithm Categories */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography
          variant="h4"
          align="center"
          color="text.primary"
          gutterBottom
          sx={{ mb: 4 }}
        >
          Algorithm Categories
        </Typography>
        <Grid container spacing={4}>
          {categories.map((category) => (
            <Grid item xs={12} md={6} key={category.title}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 2,
                      color: 'primary.main',
                    }}
                  >
                    {category.icon}
                    <Typography variant="h5" component="h2" sx={{ ml: 1 }}>
                      {category.title}
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {category.description}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Grid container spacing={1}>
                    {category.algorithms.map((algorithm) => (
                      <Grid item xs={6} key={algorithm.path}>
                        <Button
                          variant="outlined"
                          fullWidth
                          onClick={() =>
                            navigate(`/visualizer/${algorithm.path}`)
                          }
                          sx={{
                            justifyContent: 'flex-start',
                            textTransform: 'none',
                          }}
                        >
                          {algorithm.name}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
