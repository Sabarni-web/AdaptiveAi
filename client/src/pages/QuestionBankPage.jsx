import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Database } from 'lucide-react';
import teacherService from '../services/teacherService';
import { DataTable } from '../components/common/DataTable';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Textarea } from '../components/common/Textarea';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import DOMPurify from 'dompurify';

export const QuestionBankPage = () => {
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);

  const { data: questions = [], isLoading } = useQuery({
    queryKey: ['teacherQuestions'],
    queryFn: teacherService.getQuestions,
  });

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: {
      text: '',
      type: 'MCQ',
      difficulty: 0.5,
      marks: 2,
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctOption: 'A',
      modelAnswer: '',
    },
  });

  const questionType = watch('type');

  const addMutation = useMutation({
    mutationFn: teacherService.createQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries(['teacherQuestions']);
      setShowAddModal(false);
      reset();
      toast.success('Question added successfully!');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: teacherService.deleteQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries(['teacherQuestions']);
      toast.success('Question deleted successfully.');
    },
  });

  const onSubmit = (data) => {
    const formatted = {
      text: `<p>${data.text}</p>`,
      type: data.type,
      difficulty: parseFloat(data.difficulty),
      marks: parseInt(data.marks),
    };
    if (data.type === 'MCQ') {
      formatted.options = [
        { label: 'A', text: data.optionA },
        { label: 'B', text: data.optionB },
        { label: 'C', text: data.optionC },
        { label: 'D', text: data.optionD },
      ];
      formatted.correctOption = data.correctOption;
    } else {
      formatted.modelAnswer = data.modelAnswer;
    }
    addMutation.mutate(formatted);
  };

  const columns = [
    {
      key: 'text',
      header: 'Question Text',
      render: (val) => {
        const clean = DOMPurify.sanitize(val);
        return <div dangerouslySetInnerHTML={{ __html: clean }} className="text-xs truncate max-w-xs" />;
      },
    },
    { key: 'type', header: 'Type' },
    { key: 'difficulty', header: 'Difficulty (&theta;)', render: (val) => val.toFixed(2) },
    { key: 'marks', header: 'Marks' },
    {
      key: 'translations',
      header: 'Translations',
      render: (_, row) => {
        const langs = ['en'];
        if (row.translations) {
          langs.push(...Object.keys(row.translations));
        }
        return langs.join(', ');
      },
    }
  ];

  const rowActions = [
    {
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      danger: true,
      onClick: (row) => deleteMutation.mutate(row.id),
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <PageHeader
        title="Question Bank"
        description="Add, filter, and review questions of varying difficulty parameters."
        actions={[
          <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Create Question</span>
          </Button>,
        ]}
      />

      <DataTable
        columns={columns}
        data={questions}
        isLoading={isLoading}
        rowActions={rowActions}
        emptyState={
          <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <Database className="h-12 w-12 text-slate-500 mb-2" />
            <p className="font-bold">No questions found in data store.</p>
          </div>
        }
      />

      {/* Add Question Dialog */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Question"
        size="lg"
        footer={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit(onSubmit)}>
              Save Question
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <Textarea
            label="Question Statement"
            placeholder="Type statement text here..."
            {...register('text', { required: true })}
          />

          <div className="grid grid-cols-3 gap-4">
            <Select
              label="Question Type"
              options={[
                { value: 'MCQ', label: 'Multiple Choice' },
                { value: 'DESCRIPTIVE', label: 'Descriptive Answer' },
              ]}
              {...register('type')}
            />
            <Input
              label="Difficulty (0.1 - 3.0)"
              type="number"
              step="0.1"
              {...register('difficulty')}
            />
            <Input
              label="Marks value"
              type="number"
              {...register('marks')}
            />
          </div>

          {questionType === 'MCQ' ? (
            <div className="flex flex-col gap-3 mt-2 border-t border-slate-100 dark:border-slate-800 pt-4">
              <span className="text-xs font-bold text-slate-400 uppercase">Options setup</span>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Option A" placeholder="Value A" {...register('optionA')} />
                <Input label="Option B" placeholder="Value B" {...register('optionB')} />
                <Input label="Option C" placeholder="Value C" {...register('optionC')} />
                <Input label="Option D" placeholder="Value D" {...register('optionD')} />
              </div>
              <Select
                label="Correct Answer Option"
                options={[
                  { value: 'A', label: 'Option A' },
                  { value: 'B', label: 'Option B' },
                  { value: 'C', label: 'Option C' },
                  { value: 'D', label: 'Option D' },
                ]}
                {...register('correctOption')}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-3 mt-2 border-t border-slate-100 dark:border-slate-800 pt-4">
              <Textarea
                label="Model Reference Answer"
                placeholder="Type target criteria answer here..."
                {...register('modelAnswer')}
              />
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
export default QuestionBankPage;
