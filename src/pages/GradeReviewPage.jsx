import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import teacherService from '../services/teacherService';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { toast } from 'sonner';

export const GradeReviewPage = () => {
  const queryClient = useQueryClient();
  const [grades, setGrades] = useState({});

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['pendingReviews'],
    queryFn: teacherService.getPendingReviews,
  });

  const submitMutation = useMutation({
    mutationFn: ({ id, marks }) => teacherService.submitReview(id, marks),
    onSuccess: () => {
      queryClient.invalidateQueries(['pendingReviews']);
      toast.success('Grade submitted successfully!');
    },
  });

  const handleGradeChange = (id, val) => {
    setGrades((prev) => ({ ...prev, [id]: val }));
  };

  const handleSubmit = (id, maxMarks) => {
    const marks = parseFloat(grades[id]);
    if (isNaN(marks) || marks < 0 || marks > maxMarks) {
      toast.error(`Please input valid marks (0 - ${maxMarks})`);
      return;
    }
    submitMutation.mutate({ id, marks });
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <PageHeader
        title="Grade Review"
        description="Manually evaluate descriptive responses and review model answers."
      />

      {isLoading ? (
        <div className="text-center text-slate-400 py-12">Loading pending answers...</div>
      ) : items.length === 0 ? (
        <div className="text-center text-slate-400 py-12 flex flex-col items-center justify-center gap-2 bg-slate-900 border border-slate-800 rounded-2xl">
          <FileSpreadsheet className="h-10 w-10 text-slate-500" />
          <p className="font-bold">No descriptive answers require review.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {items.map((item) => (
            <Card
              key={item.id}
              title={`Answer Sheet - ${item.studentName}`}
              description="Review criteria metrics compared side-by-side."
            >
              <div className="flex flex-col gap-5 mt-4">
                <div className="flex flex-col gap-1.5 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Question Statement
                  </span>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white leading-relaxed">
                    {item.questionText}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Student Response
                    </span>
                    <div className="p-4 rounded-xl bg-white dark:bg-slate-905 border border-slate-200 dark:border-slate-800 text-sm whitespace-pre-wrap leading-relaxed">
                      {item.studentAnswer}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Evaluation Guidelines (Model Answer)
                    </span>
                    <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 text-sm italic text-slate-650 dark:text-slate-400 leading-relaxed">
                      {item.modelAnswer || 'No criteria provided.'}
                    </div>
                  </div>
                </div>

                {/* Grade Input Actions */}
                <div className="flex items-end justify-between border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
                  <div className="w-48">
                    <Input
                      label={`Award Marks (Max: ${item.maxMarks})`}
                      type="number"
                      step="0.5"
                      min="0"
                      max={item.maxMarks}
                      value={grades[item.id] || ''}
                      onChange={(e) => handleGradeChange(item.id, e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={() => handleSubmit(item.id, item.maxMarks)}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Submit Score</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
export default GradeReviewPage;
