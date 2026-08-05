import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { getMyCertificates } from '../services/certificateService';
import { Award, Download, Share2, Loader2 } from 'lucide-react';
import { CertificateViewer } from '../components/certificate/CertificateViewer';

export const StudentCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const data = await getMyCertificates();
      if (data.success) {
        setCertificates(data.certificates);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (selectedCert) {
    return (
      <div className="flex flex-col gap-6 animate-fade-in pb-12">
        <div className="flex items-center justify-between">
          <PageHeader 
            title="Certificate Details" 
            description="View and share your digital certificate." 
          />
          <button 
            onClick={() => setSelectedCert(null)}
            className="px-4 py-2 bg-surface-2 text-primary border border-hair rounded-lg hover:bg-surface-3 transition-colors"
          >
            Back to Certificates
          </button>
        </div>
        <CertificateViewer certificate={selectedCert} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <PageHeader 
        title="My Certificates" 
        description="View all certificates you've earned from completing exams." 
      />

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-secondary" /></div>
      ) : certificates.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-20 text-center">
          <Award className="w-16 h-16 text-secondary mb-4 opacity-50" />
          <h3 className="text-xl font-bold mb-2">No Certificates Yet</h3>
          <p className="text-secondary max-w-md">Complete exams with a score of 70% or higher to earn digital certificates.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <Card key={cert._id} className="group hover:border-amber-400/50 transition-colors cursor-pointer overflow-hidden relative" onClick={() => setSelectedCert(cert)}>
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none"></div>
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
                    <Award className="w-8 h-8" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-500">{cert.percentage.toFixed(0)}%</p>
                    <p className="text-xs text-secondary font-medium">Score</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-primary mb-1 line-clamp-1">{cert.examName}</h3>
                  <p className="text-secondary text-sm mb-3">Issued: {new Date(cert.issuedDate).toLocaleDateString()}</p>
                  <p className="text-xs font-mono text-secondary/60 bg-surface-2 p-1.5 rounded inline-block">{cert.certificateId}</p>
                </div>
                
                <div className="flex gap-2 mt-2 pt-4 border-t border-hair">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`http://localhost:5000/api/v1/certificates/download/${cert.certificateId}`, '_blank');
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-surface-2 hover:bg-surface-3 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Download className="w-4 h-4" /> PDF
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCert(cert);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    View
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
