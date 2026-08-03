import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  initExamStart,
  initExamSuccess,
  initExamFailure,
  setQuestion,
  setLocalAnswer,
  toggleFlaggedQuestion,
  updateAbilityState,
  submitExamSuccess,
} from '../redux/slices/examSlice';
import examService from '../services/examService';
import { toast } from 'sonner';

export const useExam = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    sessionId,
    status,
    currentQuestion,
    currentQuestionIndex,
    answers,
    flagged,
    ability,
    abilityHistory,
    timeRemaining,
    config,
    isLoading,
    error,
  } = useSelector((state) => state.exam);

  const startExam = async (examConfigId) => {
    dispatch(initExamStart());
    try {
      const data = await examService.startExam(examConfigId);
      dispatch(initExamSuccess(data));
      navigate(`/exam/${data.sessionId}`);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to start exam';
      dispatch(initExamFailure(msg));
      toast.error(msg);
    }
  };

  const loadNextQuestion = async (sessId) => {
    try {
      const data = await examService.getNextQuestion(sessId || sessionId);
      if (data.isStop) {
        await finishExam(sessId || sessionId);
      } else {
        dispatch(setQuestion({
          question: data.question,
          index: data.index,
          status: data.status,
        }));
      }
    } catch (err) {
      toast.error('Failed to load next question.');
    }
  };

  const submitAnswer = async (answerVal, timeSpent = 15) => {
    if (!currentQuestion) return null;
    try {
      dispatch(setLocalAnswer({ questionId: currentQuestion.id, answer: answerVal }));
      const response = await examService.submitAnswer(sessionId, {
        questionId: currentQuestion.id,
        answer: answerVal,
        timeSpent,
      });
      dispatch(updateAbilityState({ ability: response.ability }));
      return response;
    } catch (err) {
      toast.error('Failed to submit answer.');
      return null;
    }
  };

  const flagQuestion = () => {
    if (currentQuestionIndex === undefined || currentQuestionIndex === null) return;
    dispatch(toggleFlaggedQuestion(currentQuestionIndex));
  };

  const finishExam = async (sessId) => {
    try {
      await examService.submitExam(sessId || sessionId);
      dispatch(submitExamSuccess());
      toast.success('Exam submitted successfully!');
      navigate(`/result/${sessId || sessionId}`);
    } catch (err) {
      toast.error('Failed to submit exam.');
    }
  };

  return {
    sessionId,
    status,
    currentQuestion,
    currentQuestionIndex,
    answers,
    flagged,
    ability,
    abilityHistory,
    timeRemaining,
    config,
    isLoading,
    error,
    startExam,
    loadNextQuestion,
    submitAnswer,
    flagQuestion,
    finishExam,
  };
};
export default useExam;
