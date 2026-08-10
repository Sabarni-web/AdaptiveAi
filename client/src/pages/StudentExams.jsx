import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Play, BookOpen, Layers, Server } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useExam } from '../hooks/useExam';
import apiClient from '../services/apiClient';
import { toast } from 'sonner';

export const StudentExams = () => {
  const { startExam, isLoading } = useExam();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';
  
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState('');
  
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);

  useEffect(() => {
    fetchDomains();
  }, []);

  useEffect(() => {
    if (selectedDomain) {
      fetchSubjects(selectedDomain);
    } else {
      setSubjects([]);
      setSelectedSubject(null);
    }
  }, [selectedDomain]);

  const fetchDomains = async () => {
    try {
      const res = await apiClient.get('/question-bank/domains');
      setDomains(res.data.data);
    } catch (err) {
      toast.error('Failed to load domains');
    }
  };

  const fetchSubjects = async (domainName) => {
    try {
      const res = await apiClient.get(`/question-bank/subjects?domain=${encodeURIComponent(domainName)}`);
      setSubjects(res.data.data);
      setSelectedSubject(null);
    } catch (err) {
      toast.error('Failed to load subjects');
    }
  };

  const handleStartExam = (subject) => {
    if (!selectedDomain || !subject) {
      toast.error('Please select a domain and subject first');
      return;
    }
    
    const available = (subject.mcqCount || 0) + (subject.saqCount || 0);
    
    if (available === 0) {
      toast.error(`No questions available for this subject.`);
      return;
    }

    const numQ = Math.min(10, available); // default to 10 or max available

    startExam({
      domain: selectedDomain,
      subject: subject.name,
      questionType: 'Mixed',
      numberOfQuestions: numQ
    });
  };

  const filteredDomains = domains.filter(domain => domain.name.toLowerCase().includes(searchQuery));
  const filteredSubjects = subjects.filter(subject => subject.name.toLowerCase().includes(searchQuery));

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <PageHeader
        title="Question Bank Evaluations"
        description="Select a domain and subject to generate a customized test."
      />

      {!selectedDomain ? (
        <div className="flex flex-col gap-4">
          {searchQuery && (
            <div className="text-sm text-secondary">
              Showing results for: <span className="text-primary-500 font-bold">"{searchQuery}"</span>
            </div>
          )}
          {filteredDomains.length === 0 ? (
            <div className="text-center text-secondary mt-10">No domains found matching your search.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDomains.map((domain, idx) => (
                <Card
                  key={domain.name}
                  className="card animate-in flex flex-col justify-between gap-6 !p-8 cursor-pointer hover:border-primary-500 transition-colors"
                  style={{ animationDelay: `${idx * 80}ms` }}
                  clickable
                  onClick={() => setSelectedDomain(domain.name)}
                >
                  <div className="flex flex-col gap-2">
                    <span className="bg-primary-500/10 text-primary-500 border border-primary-500/20 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider w-fit">
                      Domain
                    </span>
                    <h2 className="text-xl md:text-2xl font-black leading-tight mt-1">
                      {domain.name}
                    </h2>
                    <p className="text-sm text-secondary font-medium">
                      {domain.subjectCount} Subjects Available
                    </p>
                  </div>
                  <div className="flex items-center text-primary-500 font-semibold text-sm">
                    View Subjects &rarr;
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <Button variant="outline" className="w-fit mb-4" onClick={() => setSelectedDomain('')}>
            &larr; Back to Domains
          </Button>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold">Select Subject for {selectedDomain}</h2>
            {searchQuery && (
              <span className="text-sm text-secondary">
                Filtered by: <span className="text-primary-500 font-bold">"{searchQuery}"</span>
              </span>
            )}
          </div>
          {filteredSubjects.length === 0 ? (
            <div className="text-center text-secondary mt-10">No subjects found matching your search.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSubjects.map((sub, idx) => (
                <Card
                  key={sub.name}
                  className="card animate-in flex flex-col justify-between gap-6 !p-8 cursor-pointer hover:border-primary-500 transition-colors"
                  style={{ animationDelay: `${idx * 80}ms` }}
                  clickable
                  onClick={() => handleStartExam(sub)}
                >
                  <div className="flex flex-col gap-2">
                    <span className="bg-accent/10 text-accent-500 border border-accent-500/20 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider w-fit">
                      Subject
                    </span>
                    <h2 className="text-xl font-black leading-tight mt-1">
                      {sub.name}
                    </h2>
                    <div className="flex gap-4 mt-2">
                      <span className="text-sm text-secondary font-medium">MCQ: {sub.mcqCount}</span>
                      <span className="text-sm text-secondary font-medium">SAQ: {sub.saqCount}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentExams;
