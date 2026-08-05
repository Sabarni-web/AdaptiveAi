import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyCertificate } from '../services/certificateService';
import { CertificateViewer } from '../components/certificate/CertificateViewer';
import { Search, ShieldCheck, ShieldAlert, Loader2 } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';

export const VerifyCertificate = () => {
  const { certificateId: urlCertId } = useParams();
  const [certId, setCertId] = useState(urlCertId || '');
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (urlCertId) {
      handleVerify(urlCertId);
    }
  }, [urlCertId]);

  const handleVerify = async (idToVerify) => {
    if (!idToVerify) return;
    setLoading(true);
    setError(null);
    setCertificate(null);
    try {
      const data = await verifyCertificate(idToVerify);
      if (data.success && data.certificate) {
        setCertificate(data.certificate);
        if (idToVerify !== urlCertId) {
          navigate(`/verify/${idToVerify}`);
        }
      } else {
        setError('Certificate Not Found or Invalid');
      }
    } catch (err) {
      setError('Certificate Not Found. Please check the ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-1 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl text-center mb-8">
        <PageHeader 
          title="Verify Certificate" 
          description="Enter a certificate ID to verify its authenticity on the AdaptiveAI platform."
        />
        
        <div className="mt-8 flex justify-center">
          <div className="relative w-full max-w-lg flex items-center">
            <input
              type="text"
              value={certId}
              onChange={(e) => setCertId(e.target.value)}
              placeholder="e.g. AAI-2026-000001"
              className="w-full px-6 py-4 rounded-full border border-hair bg-surface-2 text-primary focus:outline-none focus:ring-2 focus:ring-mint pr-36 shadow-sm"
              onKeyDown={(e) => e.key === 'Enter' && handleVerify(certId)}
            />
            <button
              onClick={() => handleVerify(certId)}
              disabled={loading || !certId}
              className="absolute right-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Verify
            </button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-secondary">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mb-4" />
            <p>Verifying digital signature...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-8 rounded-2xl flex flex-col items-center text-center animate-fade-in shadow-sm">
            <ShieldAlert className="w-16 h-16 mb-4 text-rose-500" />
            <h3 className="text-2xl font-bold mb-2">Verification Failed</h3>
            <p>{error}</p>
          </div>
        )}

        {certificate && !loading && (
          <div className="animate-fade-in flex flex-col items-center">
            <div className="mb-8 flex items-center gap-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-6 py-3 rounded-full shadow-sm">
              <ShieldCheck className="w-6 h-6" />
              <span className="font-semibold text-lg">Official AdaptiveAI Certificate Verified</span>
            </div>
            <CertificateViewer certificate={certificate} isPublic={true} />
          </div>
        )}
      </div>
    </div>
  );
};
