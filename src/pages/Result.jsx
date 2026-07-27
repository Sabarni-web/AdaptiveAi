import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import examService from '../services/examService';
import { ResultSummary } from '../components/result/ResultSummary';
import { ScoreBreakdown } from '../components/result/ScoreBreakdown';
import { AbilityTrajectory } from '../components/result/AbilityTrajectory';
import { WeakTopicsList } from '../components/result/WeakTopicsList';
import { RecommendationCard } from '../components/result/RecommendationCard';
import { AnswerReview } from '../components/result/AnswerReview';
import { CertificatePreview } from '../components/result/CertificatePreview';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { Loader } from '../components/common/Loader';
import { toast } from 'sonner';

export const Result = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [showCert, setShowCert] = useState(false);

  const { data: result, isLoading, error } = useQuery({
    queryKey: ['examResult', sessionId],
    queryFn: () => examService.getResult(sessionId),
    enabled: !!sessionId,
  });

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Share link copied to clipboard!');
    }
  };

  const handleDownloadCert = () => {
    setShowCert(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size="lg" text="Generating comprehensive feedback report..." />
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 text-center">
        <p className="text-red-500 font-bold">Failed to load exam results.</p>
        <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Top Header info */}
      <ResultSummary
        score={result.score}
        grade={result.grade}
        percentile={result.percentile}
        ability={result.ability}
        confidenceInterval={result.confidenceInterval}
        examTitle={result.examTitle}
        completedAt={result.completedAt}
        onShare={handleShare}
        onDownload={handleDownloadCert}
      />

      {/* Grid layouts for breakdowns and charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AbilityTrajectory history={result.history} />
        <ScoreBreakdown sections={result.sections} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <WeakTopicsList topics={result.topics} />
        <RecommendationCard recommendations={result.recommendations} />
      </div>

      {/* Detailed Accordion review */}
      <AnswerReview answers={result.answers} />

      {/* Certificate Viewer Modal */}
      <Modal
        isOpen={showCert}
        onClose={() => setShowCert(false)}
        title="Completion Certificate"
        description="Verify your accomplishment details."
        size="xl"
        footer={
          <Button variant="primary" onClick={() => window.print()}>
            Print Certificate
          </Button>
        }
      >
        <div className="py-4">
          <CertificatePreview
            studentName="STUDENT CANDIDATE"
            examTitle={result.examTitle}
            score={result.score.percentage}
            grade={result.grade}
            certificateId={`CERT-${sessionId?.substring(0, 8)?.toUpperCase() || 'MOCK'}`}
          />
        </div>
      </Modal>
    </div>
  );
};
export default Result;
