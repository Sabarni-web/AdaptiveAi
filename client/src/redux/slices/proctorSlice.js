import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  personCount: 1,
  multiplePersonDetected: false,
  warningLevel: 'SAFE', // SAFE, LOW, MEDIUM, HIGH, CRITICAL
  integrityScore: 100,
  violations: 0,
  // Head Tracking
  headDirection: 'FORWARD', // FORWARD, LEFT, RIGHT, UP, DOWN
  yaw: 0,
  pitch: 0,
  roll: 0,
  focusStatus: 'FOCUSED', // FOCUSED, LOOKING_AWAY
};

const proctorSlice = createSlice({
  name: 'proctor',
  initialState,
  reducers: {
    setPersonCount: (state, action) => {
      state.personCount = action.payload;
      state.multiplePersonDetected = action.payload > 1;
    },
    setWarningLevel: (state, action) => {
      state.warningLevel = action.payload;
    },
    deductIntegrityScore: (state, action) => {
      state.integrityScore = Math.max(0, state.integrityScore - action.payload);
    },
    incrementViolations: (state) => {
      state.violations += 1;
    },
    setHeadPose: (state, action) => {
      const { headDirection, yaw, pitch, roll, focusStatus } = action.payload;
      if (headDirection !== undefined) state.headDirection = headDirection;
      if (yaw !== undefined) state.yaw = yaw;
      if (pitch !== undefined) state.pitch = pitch;
      if (roll !== undefined) state.roll = roll;
      if (focusStatus !== undefined) state.focusStatus = focusStatus;
    },
    resetProctorState: () => initialState
  }
});

export const {
  setPersonCount,
  setWarningLevel,
  deductIntegrityScore,
  incrementViolations,
  setHeadPose,
  resetProctorState
} = proctorSlice.actions;

export default proctorSlice.reducer;
