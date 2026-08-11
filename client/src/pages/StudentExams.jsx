import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, BookOpen } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Loader } from '../components/common/Loader';
import { useExam } from '../hooks/useExam';
import examService from '../services/examService';
import apiClient from '../services/apiClient';
import { toast } from 'sonner';

export const StudentExams = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { startExam, isLoading: startingExam } = useExam();

  const searchQuery = searchParams.get('search') || '';
  const domainQuery = searchParams.get('domain') || '';
  const subjectQuery = searchParams.get('subject') || '';

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter options loaded from API
  const [domains, setDomains] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    fetchExams();
  }, [searchQuery, domainQuery, subjectQuery]);

  useEffect(() => {
    fetchSubjects(domainQuery);
  }, [domainQuery]);

  const fetchFilterOptions = async () => {
    try {
      const res = await apiClient.get('/question-bank/domains');
      setDomains(res.data.data);
    } catch (err) {
      toast.error('Failed to load domains');
    }
  };

  const fetchSubjects = async (domainName) => {
    try {
      const url = domainName 
        ? `/question-bank/subjects?domain=${encodeURIComponent(domainName)}`
        : `/question-bank/subjects`;
      const res = await apiClient.get(url);
      setSubjects(res.data.data);
    } catch (err) {
      toast.error('Failed to load subjects');
    }
  };

  const fetchExams = async () => {
    setLoading(true);
    try {
      const data = await examService.searchExams({
        search: searchQuery,
        domain: domainQuery,
        subject: subjectQuery
      });
      setExams(data || []);
    } catch (err) {
      toast.error('Failed to search exams');
    } finally {
      setLoading(false);
    }
  };

  const updateSearch = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
      // Reset subject if domain changes
      if (key === 'domain') newParams.delete('subject');
    } else {
      newParams.delete(key);
      if (key === 'domain') newParams.delete('subject');
    }
    setSearchParams(newParams);
  };

  const handleStartExam = (exam) => {
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

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <PageHeader
        title="Search Exams"
        description="Find and start adaptive evaluations matching your criteria."
      />

      {/* Filters */}
      <Card className="!p-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex w-full md:w-auto gap-4">
          <div className="relative flex-1 md:w-64">
            <select
              value={domainQuery}
              onChange={(e) => updateSearch('domain', e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-2.5 rounded-lg bg-black/20 border border-hair text-white outline-none focus:border-primary-500 transition-colors"
            >
              <option value="">All Domains</option>
              {domains.map((d) => (
                <option key={d.name} value={d.name}>{d.name}</option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary pointer-events-none" />
          </div>

          <div className="relative flex-1 md:w-64">
            <select
              value={subjectQuery}
              onChange={(e) => updateSearch('subject', e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-2.5 rounded-lg bg-black/20 border border-hair text-white outline-none focus:border-primary-500 transition-colors"
            >
              <option value="">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.name} value={s.name}>{s.name}</option>
              ))}
            </select>
            <BookOpen className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary pointer-events-none" />
          </div>
        </div>
      </Card>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader size="lg" text="Searching exams..." />
        </div>
      ) : exams.length === 0 ? (
        <Card className="!p-12 flex flex-col items-center text-center">
          <div className="bg-primary-500/10 p-4 rounded-full mb-4">
            <Search className="h-8 w-8 text-primary-500" />
          </div>
          <h3 className="text-xl font-bold mb-2">No exams found</h3>
          <p className="text-secondary max-w-md">
            Try another domain or subject, or broaden your search criteria.
          </p>
          <Button variant="outline" className="mt-6" onClick={() => setSearchParams(new URLSearchParams())}>
            Clear Filters
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam, idx) => (
            <Card
              key={exam._id}
              className="flex flex-col gap-4 !p-6 hover:border-primary-500 transition-colors"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div>
                <h3 className="text-xl font-bold mb-1 truncate" title={exam.title}>{exam.title}</h3>
                <p className="text-sm text-secondary truncate">{exam.subject}</p>
              </div>



              <Button
                className="w-full mt-2"
                onClick={() => handleStartExam(exam)}
                disabled={startingExam}
              >
                {startingExam ? 'Initializing...' : 'Start Exam'}
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentExams;
