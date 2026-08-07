import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  faceDetected: false,
  confidence: 0,
  warnings: 0,
  violations: 0,
  cameraStatus: 'INITIALIZING', // INITIALIZING, READY, ERROR, DENIED
  isMonitoring: false,
};

const proctoringSlice = createSlice({
  name: 'proctoring',
  initialState,
  reducers: {
    setFaceDetected: (state, action) => {
      state.faceDetected = action.payload.detected;
      state.confidence = action.payload.confidence || 0;
    },
    incrementWarning: (state) => {
      state.warnings += 1;
    },
    incrementViolation: (state) => {
      state.violations += 1;
    },
    setCameraStatus: (state, action) => {
      state.cameraStatus = action.payload;
    },
    setIsMonitoring: (state, action) => {
      state.isMonitoring = action.payload;
    },
    resetProctoring: (state) => {
      return initialState;
    }
  },
});

export const { 
  setFaceDetected, 
  incrementWarning, 
  incrementViolation, 
  setCameraStatus,
  setIsMonitoring,
  resetProctoring 
} = proctoringSlice.actions;

export default proctoringSlice.reducer;
