import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AlgorithmState {
  currentAlgorithm: string | null;
  executionSteps: any[];
  currentStep: number;
  input: any;
  output: any;
  isRunning: boolean;
  error: string | null;
}

const initialState: AlgorithmState = {
  currentAlgorithm: null,
  executionSteps: [],
  currentStep: -1,
  input: null,
  output: null,
  isRunning: false,
  error: null,
};

const algorithmSlice = createSlice({
  name: "algorithm",
  initialState,
  reducers: {
    setCurrentAlgorithm: (state, action: PayloadAction<string>) => {
      state.currentAlgorithm = action.payload;
      state.executionSteps = [];
      state.currentStep = -1;
      state.input = null;
      state.output = null;
      state.error = null;
    },
    setExecutionSteps: (state, action: PayloadAction<any[]>) => {
      state.executionSteps = action.payload;
      state.currentStep = 0;
    },
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    nextStep: (state) => {
      if (state.currentStep < state.executionSteps.length - 1) {
        state.currentStep += 1;
      }
    },
    previousStep: (state) => {
      if (state.currentStep > 0) {
        state.currentStep -= 1;
      }
    },
    setInput: (state, action: PayloadAction<any>) => {
      state.input = action.payload;
    },
    setOutput: (state, action: PayloadAction<any>) => {
      state.output = action.payload;
    },
    setIsRunning: (state, action: PayloadAction<boolean>) => {
      state.isRunning = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCurrentAlgorithm,
  setExecutionSteps,
  setCurrentStep,
  nextStep,
  previousStep,
  setInput,
  setOutput,
  setIsRunning,
  setError,
} = algorithmSlice.actions;

export default algorithmSlice.reducer;
