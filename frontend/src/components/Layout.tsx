import { ReactNode, useState } from 'react';
import {
  AppBar,
  Box,
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  Collapse,
  Tooltip,
  Button,
  useMediaQuery,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountTree,
  Functions,
  Timeline,
  Route,
  GitHub,
  ExpandLess,
  ExpandMore,
  Home as HomeIcon,
  Speed as SpeedIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

const DRAWER_WIDTH = 280;

const Layout = ({ children }: LayoutProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const menuItems = [
    {
      text: 'Graph Traversal',
      icon: <AccountTree />,
      algorithms: [
        { name: 'DFS', path: 'dfs', description: 'Depth-First Search' },
        { name: 'BFS', path: 'bfs', description: 'Breadth-First Search' },
        { name: 'Dijkstra', path: 'dijkstra', description: 'Shortest Path' },
        { name: 'A*', path: 'astar', description: 'Heuristic Search' },
      ],
    },
    {
      text: 'Dynamic Programming',
      icon: <Functions />,
      algorithms: [
        {
          name: 'Knapsack',
          path: 'knapsack',
          description: '0/1 Knapsack Problem',
        },
        { name: 'LCS', path: 'lcs', description: 'Longest Common Subsequence' },
        {
          name: 'Matrix Chain',
          path: 'matrix-chain',
          description: 'Matrix Chain Multiplication',
        },
      ],
    },
    {
      text: 'Optimization',
      icon: <Timeline />,
      algorithms: [
        {
          name: 'Linear Programming',
          path: 'linear-programming',
          description: 'Simplex Method',
        },
        {
          name: 'Min-Cost Flow',
          path: 'min-cost-flow',
          description: 'Network Flow Optimization',
        },
        { name: 'Max-Flow', path: 'max-flow', description: 'Maximum Flow' },
        {
          name: 'Gradient Descent',
          path: 'gradient-descent',
          description: 'Nonlinear Optimization',
        },
        {
          name: 'Constrained',
          path: 'constrained',
          description: 'Constrained Optimization',
        },
      ],
    },
    {
      text: 'Shortest Paths',
      icon: <Route />,
      algorithms: [
        {
          name: 'Bellman-Ford',
          path: 'bellman-ford',
          description: 'Negative Weight Edges',
        },
        {
          name: 'Floyd-Warshall',
          path: 'floyd-warshall',
          description: 'All Pairs Shortest Path',
        },
      ],
    },
  ];

  const handleCategoryClick = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const handleAlgorithmClick = (path: string) => {
    navigate(`/visualizer/${path}`);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const drawer = (
    <Box sx={{ overflow: 'auto' }}>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          AlgoVis
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        <ListItem
          onClick={() => {
            navigate('/');
            if (isMobile) setDrawerOpen(false);
          }}
          sx={{
            cursor: 'pointer',
            bgcolor:
              location.pathname === '/' ? 'action.selected' : 'transparent',
          }}
        >
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>

        {menuItems.map((category) => (
          <Box key={category.text}>
            <ListItem
              onClick={() => handleCategoryClick(category.text)}
              sx={{
                bgcolor:
                  expandedCategory === category.text
                    ? 'action.selected'
                    : 'transparent',
                cursor: 'pointer',
              }}
            >
              <ListItemIcon>{category.icon}</ListItemIcon>
              <ListItemText primary={category.text} />
              {expandedCategory === category.text ? (
                <ExpandLess />
              ) : (
                <ExpandMore />
              )}
            </ListItem>
            <Collapse
              in={expandedCategory === category.text}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding>
                {category.algorithms.map((algorithm) => (
                  <Tooltip
                    key={algorithm.path}
                    title={algorithm.description}
                    placement="right"
                    arrow
                  >
                    <ListItem
                      onClick={() => handleAlgorithmClick(algorithm.path)}
                      sx={{
                        pl: 4,
                        cursor: 'pointer',
                        bgcolor:
                          location.pathname === `/visualizer/${algorithm.path}`
                            ? 'action.selected'
                            : 'transparent',
                      }}
                    >
                      <ListItemText
                        primary={algorithm.name}
                        primaryTypographyProps={{
                          fontSize: '0.9rem',
                        }}
                      />
                    </ListItem>
                  </Tooltip>
                ))}
              </List>
            </Collapse>
          </Box>
        ))}

        <Divider sx={{ my: 2 }} />

        <ListItem
          onClick={() => window.open('/benchmark', '_blank')}
          sx={{ cursor: 'pointer' }}
        >
          <ListItemIcon>
            <SpeedIcon />
          </ListItemIcon>
          <ListItemText primary="Benchmarks" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          bgcolor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(!drawerOpen)}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            AlgoVis
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              startIcon={<CodeIcon />}
              color="inherit"
              onClick={() =>
                window.open('https://github.com/yourusername/algovis', '_blank')
              }
            >
              Documentation
            </Button>
            <IconButton
              color="inherit"
              onClick={() =>
                window.open('https://github.com/yourusername/algovis', '_blank')
              }
              size="large"
            >
              <GitHub />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{
          width: { md: DRAWER_WIDTH },
          flexShrink: { md: 0 },
        }}
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: DRAWER_WIDTH,
              },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: DRAWER_WIDTH,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        )}
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Toolbar />
        <Container maxWidth="xl">{children}</Container>
      </Box>
    </Box>
  );
};

export default Layout;
