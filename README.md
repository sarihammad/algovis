# AlgoVis

An interactive algorithm visualization platform for learning and understanding complex algorithms through visual representations. 

AlgoVis is a web-based algorithm visualization platform using Python, Flask, React, D3.js, and AWS Lambda, covering graph traversal (DFS, BFS, Dijkstra’s, A\*), dynamic programming (Knapsack, LCS), shortest paths, and optimization algorithms (Linear Programming, Min-Cost Flow, Max-Flow)*. Features real-time execution, step-by-step visualization, and performance benchmarking with Big-O analysis.

## Features

- Interactive visualization of various algorithms:
  - Graph Traversal (DFS, BFS, Dijkstra's, A\*)
  - Dynamic Programming (Knapsack, LCS, Matrix Chain)
  - Shortest Paths
  - Advanced Optimization (Linear Programming, Nonlinear Optimization)
  - Network Flow (Min-Cost Flow, Max-Flow)
- Real-time algorithm execution with step-by-step visualization
- Performance analysis with Big-O benchmarks
- Interactive graph and matrix visualizations using D3.js
- Scalable backend powered by Flask and AWS Lambda

## Project Structure

```
algovis/
├── frontend/           # React + TypeScript frontend
├── backend/           # Flask backend
├── algorithms/        # Algorithm implementations
└── infrastructure/   # AWS Lambda and deployment configs
```

## Setup Instructions

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   npm install
   npm start
   ```

2. The development server will start at `http://localhost:3000`

### Backend Setup

1. Create and activate a virtual environment:

   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Start the Flask server:
   ```bash
   python app.py
   ```

## Development

- Frontend: React 18 with TypeScript and D3.js for visualizations
- Backend: Flask with Python 3.8+
- API: RESTful endpoints for algorithm execution
- Deployment: AWS Lambda for computation, AWS Amplify/Vercel for frontend

## License

This project is licensed under the MIT License - see the LICENSE file for details.
