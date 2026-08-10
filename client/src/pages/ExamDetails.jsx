import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, ArrowLeft, Clock, Target, Shield, BookOpen, Layers } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Loader } from '../components/common/Loader';
import { useExam } from '../hooks/useExam';
import examService from '../services/examService';
import { toast } from 'sonner';

export const ExamDetails = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { startExam, isLoading: startingExam } = useExam();

  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExamDetails();
  }, [examId]);

  const fetchExamDetails = async () => {
    try {
      const data = await examService.getExamDetails(examId);
      setExam(data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Exam not found');
      } else {
        toast.error('Failed to load exam details');
        setError('An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStartExam = () => {
    if (!exam) return;
    
    // We connect the selected exam configuration to the existing adaptive AI session starter
    const requestedQ = exam.questionPool?.questionCount || exam.adaptiveSettings?.maxQuestions || 10;
    const numQ = Math.min(requestedQ, 10);
    const trueSubject = exam.questionPool?.chapters?.[0] || exam.title;
    
    startExam({
      domain: exam.subject,
      subject: trueSubject,
      questionType: 'Mixed',
      numberOfQuestions: numQ
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader size="xl" text="Loading exam details..." />
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6 text-center animate-fade-in">
        <div className="bg-red-500/10 p-6 rounded-full text-red-500">
          <Target className="h-12 w-12" />
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-2">{error || 'Exam not found'}</h2>
          <p className="text-secondary max-w-md mx-auto">
            This exam may have been removed or is no longer available.
          </p>
        </div>
        <Button variant="outline" size="lg" onClick={() => navigate('/exams')}>
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Exams
        </Button>
      </div>
    );
  }

  const duration = exam.timing?.duration || (exam.adaptiveSettings?.maxQuestions * 2) || 20;
  const numQuestions = Math.min(exam.questionPool?.questionCount || exam.adaptiveSettings?.maxQuestions || 10, 10);

  return (
    <div className="flex flex-col gap-8 animate-fade-in max-w-5xl mx-auto">
      <Button variant="ghost" className="w-fit -ml-4" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black">{exam.title}</h1>
        <p className="text-xl text-secondary">{exam.subject}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 flex flex-col gap-6">
          <Card className="!p-8">
            <h2 className="text-2xl font-bold mb-4">Description</h2>
            <p className="text-secondary leading-relaxed">
              {exam.description || 'This is an adaptive evaluation designed to test your proficiency in this subject. Questions will adapt to your ability level in real-time.'}
            </p>
          </Card>

          <Card className="!p-8">
            <h2 className="text-2xl font-bold mb-4">Instructions</h2>
            <ul className="list-disc list-inside space-y-3 text-secondary">
              <li>This is an AI-proctored exam. Ensure your camera is enabled.</li>
              <li>Do not leave the tab or switch applications during the exam.</li>
              <li>The difficulty of questions will adapt based on your answers.</li>
              <li>You cannot return to previous questions once submitted.</li>
              {exam.security?.fullscreenRequired && <li>Fullscreen mode is strictly enforced.</li>}
            </ul>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="!p-8 flex flex-col gap-6">
            <h3 className="text-lg font-bold border-b border-hair pb-4">Exam Summary</h3>
            
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-500/10 text-blue-500">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-secondary">Questions</p>
                <p className="font-bold">{numQuestions}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-orange-500/10 text-orange-500">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-secondary">Duration</p>
                <p className="font-bold">{duration} minutes</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-500/10 text-green-500">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-secondary">Difficulty</p>
                <p className="font-bold">Adaptive AI</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-500/10 text-purple-500">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-secondary">Proctoring</p>
                <p className="font-bold">Enabled</p>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full mt-4 h-14 text-lg"
              onClick={handleStartExam}
              disabled={startingExam}
            >
              {startingExam ? 'Initializing Exam...' : 'START EXAM'}
              {!startingExam && <Play className="h-5 w-5 ml-2 fill-current" />}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
