import axios from "axios";
import { SimulationNodeDatum } from "d3";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface Node extends SimulationNodeDatum {
  id: string;
  value?: number;
  state?: "unvisited" | "visited" | "current" | "next" | "path";
}

export interface Edge {
  source: string | Node;
  target: string | Node;
  weight?: number;
  capacity?: number;
  cost?: number;
  flow?: number;
  state?: "normal" | "path";
}

export interface Graph {
  nodes: Node[];
  edges: Edge[];
}

export interface Step {
  type: string;
  nodes: Node[];
  edges: Edge[];
  visited: string[];
  current: string;
  next?: string;
  distances?: { [key: string]: number };
  path?: string[];
  message: string;
}

export const graphApi = {
  getSampleGraph: async (): Promise<Graph> => {
    const response = await api.get("/graph/sample");
    return response.data;
  },

  traverseGraph: async (
    algorithm: string,
    graph: Graph,
    start: string,
    end?: string
  ): Promise<Step[]> => {
    const response = await api.post(`/graph/traverse/${algorithm}`, {
      nodes: graph.nodes,
      edges: graph.edges,
      start,
      end,
    });
    return response.data.steps;
  },
};

export interface KnapsackInput {
  weights: number[];
  values: number[];
  capacity: number;
}

export interface LCSInput {
  str1: string;
  str2: string;
}

export interface MatrixChainInput {
  dimensions: number[];
}

export const dpApi = {
  solveKnapsack: async (input: KnapsackInput): Promise<Step[]> => {
    const response = await api.post("/dp/knapsack", input);
    return response.data.steps;
  },

  solveLCS: async (input: LCSInput): Promise<Step[]> => {
    const response = await api.post("/dp/lcs", input);
    return response.data.steps;
  },

  solveMatrixChain: async (input: MatrixChainInput): Promise<Step[]> => {
    const response = await api.post("/dp/matrix-chain", input);
    return response.data.steps;
  },
};

export interface SimplexInput {
  objective: number[];
  constraints: number[][];
  bounds: number[];
  maximize?: boolean;
}

export interface NetworkFlowInput {
  graph: Graph;
  source: string;
  sink: string;
  demand?: number;
}

export interface OptimizationStep {
  type: "nonlinear" | "constrained";
  point: number[];
  objective_value: number;
  gradient?: number[];
  iteration: number;
  improvement?: number;
  message: string;
}

export interface NonlinearInput {
  initial_point: number[];
  learning_rate?: number;
  max_iterations?: number;
  tolerance?: number;
}

export interface ConstrainedInput {
  initial_point: number[];
  constraints: {
    type: "eq" | "ineq";
    fun: string;
    jac?: string;
  }[];
  method?: string;
}

export const optimizationApi = {
  solveSimplex: async (input: SimplexInput): Promise<Step[]> => {
    const response = await api.post("/optimization/simplex", input);
    return response.data.steps;
  },

  solveMaxFlow: async (input: NetworkFlowInput): Promise<Step[]> => {
    const response = await api.post("/optimization/max-flow", {
      nodes: input.graph.nodes,
      edges: input.graph.edges,
      source: input.source,
      sink: input.sink,
    });
    return response.data.steps;
  },

  solveMinCostFlow: async (input: NetworkFlowInput): Promise<Step[]> => {
    const response = await api.post("/optimization/min-cost-flow", {
      nodes: input.graph.nodes,
      edges: input.graph.edges,
      source: input.source,
      sink: input.sink,
      demand: input.demand,
    });
    return response.data.steps;
  },

  solveGradientDescent: async (
    input: NonlinearInput
  ): Promise<OptimizationStep[]> => {
    const response = await api.post("/optimization/gradient-descent", input);
    return response.data.steps;
  },

  solveConstrained: async (
    input: ConstrainedInput
  ): Promise<OptimizationStep[]> => {
    const response = await api.post("/optimization/constrained", input);
    return response.data.steps;
  },
};
