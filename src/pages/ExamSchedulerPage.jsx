import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Calendar, Clock, Database } from 'lucide-react';
import teacherService from '../services/teacherService';
import { PageHeader } from '../components/common/PageHeader';
import { DataTable } from '../components/common/DataTable';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { toast } from 'sonner';

export const ExamSchedulerPage = () => {
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);

  const { data: exams = [], isLoading } = useQuery({
    queryKey: ['teacherExams'],
    queryFn: teacherService.getExams,
  });

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      title: '',
      subject: '',
      durationSeconds: 1800,
      questionLimit: 10,
    },
  });

  const addMutation = useMutation({
    mutationFn: teacherService.createExam,
    onSuccess: () => {
      queryClient.invalidateQueries(['teacherExams']);
      setShowAddModal(false);
      reset();
      toast.success('Exam session scheduled successfully!');
    },
  });

  const onSubmit = (data) => {
    addMutation.mutate({
      ...data,
      durationSeconds: parseInt(data.durationSeconds),
      questionLimit: parseInt(data.questionLimit),
    });
  };

  const columns = [
    { key: 'title', header: 'Exam Title' },
    { key: 'subject', header: 'Subject Code' },
    {
      key: 'durationSeconds',
      header: 'Duration',
      render: (val) => `${Math.round(val / 60)} minutes`,
    },
    { key: 'questionLimit', header: 'Max Questions' },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <PageHeader
        title="Exam Scheduler"
        description="Schedule adaptive evaluation events and configure stopping rules."
        actions={[
          <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Schedule Session</span>
          </Button>,
        ]}
      />

      <DataTable
        columns={columns}
        data={exams}
        isLoading={isLoading}
        emptyState={
          <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <Calendar className="h-12 w-12 text-slate-500 mb-2" />
            <p className="font-bold">No evaluation sessions scheduled.</p>
          </div>
        }
      />

      {/* Schedule Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Schedule Evaluation Session"
        footer={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit(onSubmit)}>
              Schedule Exam
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <Input
            label="Evaluation Session Title"
            placeholder="e.g., Final Year Thesis Qualifier"
            {...register('title', { required: true })}
          />

          <Input
            label="Subject Code / Department"
            placeholder="e.g., CS-402"
            {...register('subject', { required: true })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Duration Limit (in seconds)"
              type="number"
              {...register('durationSeconds', { required: true })}
            />
            <Input
              label="Max Questions (Stopping rule limit)"
              type="number"
              {...register('questionLimit', { required: true })}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default ExamSchedulerPage;
