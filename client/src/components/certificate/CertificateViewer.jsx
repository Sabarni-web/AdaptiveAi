import React from 'react';
import { motion } from 'framer-motion';
import QRCode from 'react-qr-code';
import { Download, Share2, Link } from 'lucide-react';
import { toast } from 'sonner';

export const CertificateViewer = ({ certificate, isPublic = false }) => {
  if (!certificate) return null;

  const handleDownloadPDF = () => {
    window.open(`http://localhost:5000/api/v1/certificates/download/${certificate.certificateId}`, '_blank');
  };

  const handleShare = (platform) => {
    const url = `${window.location.origin}/verify/${certificate.certificateId}`;
    const text = `🎉 I successfully completed the ${certificate.examName} on AdaptiveAI with a score of ${certificate.percentage.toFixed(2)}%!`;
    
    if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    } else {
      navigator.clipboard.writeText(`${text} ${url}`);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, type: 'spring' }}
        className="relative w-full max-w-5xl aspect-[1.414/1] overflow-hidden rounded-lg shadow-2xl p-1 bg-gradient-to-br from-slate-900 to-black text-white"
      >
        {/* Gold Border */}
        <div className="absolute inset-4 border-[6px] border-amber-400 rounded-lg opacity-90 pointer-events-none"></div>
        <div className="absolute inset-6 border border-amber-400 rounded opacity-50 pointer-events-none"></div>

        {/* Content Container - Glassmorphism */}
        <div className="absolute inset-8 bg-slate-900/40 backdrop-blur-sm border border-white/10 rounded flex flex-col p-10 z-10 text-center items-center justify-between">
          
          <div className="flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-amber-400 tracking-wider uppercase drop-shadow-md">
              Certificate of Completion
            </h1>
            <div className="h-1 w-48 bg-amber-400 mt-4 mx-auto rounded-full"></div>
          </div>

          <div className="flex flex-col gap-2 my-auto">
            <p className="text-slate-400 text-lg uppercase tracking-widest">This is to certify that</p>
            <h2 className="text-4xl md:text-6xl font-script font-bold text-white my-4" style={{ fontFamily: 'Georgia, serif' }}>
              {certificate.studentName}
            </h2>
            <p className="text-slate-400 text-lg uppercase tracking-widest">has successfully completed the assessment for</p>
            <h3 className="text-2xl md:text-4xl font-bold text-sky-400 mt-4 uppercase">
              {certificate.examName}
            </h3>
            
            <div className="flex justify-center gap-6 mt-6">
              <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-lg backdrop-blur-md">
                <p className="text-slate-400 text-xs uppercase mb-1">Score</p>
                <p className="text-2xl font-bold text-white">{certificate.percentage.toFixed(2)}%</p>
              </div>
              <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-lg backdrop-blur-md">
                <p className="text-slate-400 text-xs uppercase mb-1">Grade</p>
                <p className="text-2xl font-bold text-amber-400">{certificate.grade}</p>
              </div>
            </div>
            
            {/* Badges */}
            {certificate.badges && certificate.badges.length > 0 && (
              <div className="flex justify-center gap-2 mt-4 flex-wrap">
                {certificate.badges.map((badge, idx) => (
                  <span key={idx} className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-semibold shadow-inner">
                    {badge}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between items-end w-full px-12 pb-4">
            <div className="flex flex-col items-center">
              <div className="bg-white p-2 rounded-lg">
                <QRCode value={`https://adaptiveai.com/verify/${certificate.certificateId}`} size={80} />
              </div>
              <p className="text-slate-500 text-[10px] mt-2 font-mono">{certificate.certificateId}</p>
            </div>
            
            <div className="flex flex-col items-center gap-1">
              <div className="w-48 border-b border-slate-600 mb-2"></div>
              <p className="text-emerald-400 font-bold tracking-wide">Digitally Verified</p>
              <p className="text-slate-400 text-xs">AdaptiveAI Assessment Engine</p>
              <p className="text-slate-500 text-[10px]">AI Confidence: 98%</p>
              <p className="text-slate-500 text-[10px]">Date: {new Date(certificate.issuedDate).toLocaleDateString()}</p>
            </div>
          </div>

        </div>
      </motion.div>

      <div className="flex flex-wrap gap-4 justify-center mt-6">
        <button 
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-indigo-900/20"
        >
          <Download className="w-5 h-5" /> Download HD PDF
        </button>
        {!isPublic && (
          <>
            <button 
              onClick={() => handleShare('linkedin')}
              className="flex items-center gap-2 bg-[#0077b5] hover:bg-[#005e93] text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg"
            >
              Share on LinkedIn
            </button>
            <button 
              onClick={() => handleShare('twitter')}
              className="flex items-center gap-2 bg-black border border-white/20 hover:bg-zinc-900 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg"
            >
              Post to X
            </button>
            <button 
              onClick={() => handleShare('copy')}
              className="flex items-center gap-2 bg-surface-2 hover:bg-surface-3 text-primary border border-hair px-6 py-3 rounded-xl font-medium transition-colors shadow-lg"
            >
              <Link className="w-5 h-5" /> Copy Link
            </button>
          </>
        )}
      </div>
      
      {/* AI Performance Summary */}
      {!isPublic && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mt-8">
          <div className="bg-surface-1 border border-hair rounded-2xl p-6 shadow-sm">
            <h4 className="text-lg font-semibold text-emerald-500 mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              Strong Areas
            </h4>
            <div className="flex flex-wrap gap-2">
              {certificate.strongAreas?.map(area => (
                <span key={area} className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-lg text-sm">{area}</span>
              ))}
            </div>
          </div>
          <div className="bg-surface-1 border border-hair rounded-2xl p-6 shadow-sm">
            <h4 className="text-lg font-semibold text-rose-500 mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-500"></span>
              Areas for Improvement
            </h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {certificate.weakAreas?.map(area => (
                <span key={area} className="bg-rose-500/10 text-rose-600 dark:text-rose-400 px-3 py-1 rounded-lg text-sm">{area}</span>
              ))}
            </div>
            <div className="bg-surface-2 p-4 rounded-xl border border-hair">
              <p className="text-sm text-secondary mb-1">AI Recommendation:</p>
              <p className="text-primary font-medium">{certificate.learningRecommendation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
