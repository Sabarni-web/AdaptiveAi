import React from 'react';
import QRCode from 'react-qr-code';
import { Download, Link } from 'lucide-react';
import { toast } from 'sonner';

export const CertificatePreview = ({
  studentName = 'Candidate Name',
  examTitle = 'Evaluation Domain',
  score = 0,
  grade = 'N/A',
  date = new Date().toLocaleDateString(),
  certificateId = 'CERT-000000',
}) => {
  const handleDownloadPDF = () => {
    window.open(`http://localhost:5000/api/v1/certificates/download/${certificateId}`, '_blank');
  };

  const handleShare = (platform) => {
    const url = `${window.location.origin}/verify/${certificateId}`;
    const text = `🎉 I successfully completed the ${examTitle} on AdaptiveAI with a score of ${score}%!`;
    
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
      <div className="w-full max-w-4xl mx-auto relative aspect-[1.414/1] overflow-hidden rounded-lg shadow-2xl bg-black text-white select-none">
        
        {/* Inner Deep Blue Background */}
        <div className="absolute inset-4 bg-slate-900"></div>

        {/* Double Gold Border */}
        <div className="absolute inset-4 border-[6px] border-amber-400 rounded-sm pointer-events-none"></div>
        <div className="absolute inset-5 border border-slate-900 rounded-sm pointer-events-none"></div>
        <div className="absolute inset-[22px] border border-amber-400 rounded-sm pointer-events-none"></div>

        {/* Content Container */}
        <div className="absolute inset-8 flex flex-col pt-10 pb-8 px-12 z-10 text-center items-center justify-between">
          
          <div className="flex flex-col gap-3 my-auto text-center items-center w-full">
            <h1 className="text-4xl md:text-5xl font-bold text-amber-400 mb-6 uppercase tracking-wider">
              Certificate of Completion
            </h1>
            
            <p className="text-slate-400 text-lg md:text-xl">
              This is to certify that
            </p>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white my-3">
              {studentName}
            </h2>
            
            <p className="text-slate-400 text-lg md:text-xl">
              has successfully completed the assessment for
            </p>
            
            <h3 className="text-3xl md:text-4xl font-bold text-sky-400 mt-3 mb-4">
              {examTitle}
            </h3>
            
            <p className="text-slate-300 text-lg md:text-xl">
              Score: {Number(score).toFixed(2)}% | Grade: {grade}
            </p>
          </div>

          {/* Bottom Section */}
          <div className="flex justify-between items-end w-full mt-auto">
            {/* Left: Date & ID */}
            <div className="flex flex-col items-start gap-1 text-slate-400 text-sm md:text-base w-1/3">
              <p>Date: {date}</p>
              <p>Certificate ID: {certificateId}</p>
            </div>
            
            {/* Center: QR Code */}
            <div className="flex flex-col items-center justify-center w-1/3 pb-2">
              <div className="bg-white p-2">
                <QRCode value={`https://adaptiveai.com/verify/${certificateId}`} size={80} />
              </div>
            </div>
            
            {/* Right: Verification */}
            <div className="flex flex-col items-start gap-1 w-1/3 pb-1">
              <p className="text-emerald-500 font-bold text-sm md:text-base leading-tight">
                Digitally Verified by AdaptiveAI<br/>Assessment Engine
              </p>
              <p className="text-slate-400 text-sm md:text-base">
                AI Confidence: 98%
              </p>
            </div>
          </div>

        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center w-full">
        <button 
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-blue-900/20"
        >
          <Download className="w-5 h-5" /> Download HD PDF
        </button>
        <button 
          onClick={() => handleShare('linkedin')}
          className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg"
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
          className="flex items-center gap-2 bg-transparent hover:bg-white/5 text-slate-200 border border-slate-600 px-6 py-3 rounded-xl font-medium transition-colors shadow-lg"
        >
          <Link className="w-5 h-5" /> Copy Link
        </button>
      </div>
    </div>
  );
};
export default CertificatePreview;
