import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sessionId: null,
  status: 'idle', // 'idle' | 'initializing' | 'estimating' | 'adaptive' | 'submitting' | 'completed'
  currentQuestion: null,
  currentQuestionIndex: 0,
  answers: {}, // { questionId: answer }
  flagged: [], // [questionId]
  ability: 0,
  abilityHistory: [],
  timeRemaining: 0,
  config: null,
  error: null,
  isLoading: false,
};

const examSlice = createSlice({
  name: 'exam',
  initialState,
  reducers: {
    initExamStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    initExamSuccess(state, action) {
      state.isLoading = false;
      state.sessionId = action.payload.sessionId;
      state.status = action.payload.status || 'initializing';
      state.config = action.payload.config;
      state.timeRemaining = action.payload.config?.durationSeconds || 3600;
    },
    initExamFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    setQuestion(state, action) {
      state.currentQuestion = action.payload.question;
      state.currentQuestionIndex = action.payload.index;
      state.status = action.payload.status || state.status;
    },
    setLocalAnswer(state, action) {
      const { questionId, answer } = action.payload;
      state.answers[questionId] = answer;
    },
    toggleFlaggedQuestion(state, action) {
      const questionId = action.payload;
      if (state.flagged.includes(questionId)) {
        state.flagged = state.flagged.filter(id => id !== questionId);
      } else {
        state.flagged.push(questionId);
      }
    },
    updateAbilityState(state, action) {
      state.ability = action.payload.ability;
      state.abilityHistory.push({
        questionIndex: state.currentQuestionIndex,
        ability: action.payload.ability,
        timestamp: new Date().toISOString(),
      });
    },
    updateTimeRemaining(state, action) {
      state.timeRemaining = action.payload;
    },
    submitExamSuccess(state) {
      state.status = 'completed';
      state.currentQuestion = null;
    },
    resetExam(state) {
      return initialState;
    },
  },
});

export const {
  initExamStart,
  initExamSuccess,
  initExamFailure,
  setQuestion,
  setLocalAnswer,
  toggleFlaggedQuestion,
  updateAbilityState,
  updateTimeRemaining,
  submitExamSuccess,
  resetExam,
} = examSlice.actions;

export default examSlice.reducer;
