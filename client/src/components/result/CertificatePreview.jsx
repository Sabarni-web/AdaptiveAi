import React from 'react';
import { Card } from '../common/Card';
import { Award, Shield } from 'lucide-react';

export const CertificatePreview = ({
  studentName = 'Candidate Name',
  examTitle = 'Evaluation Domain',
  score = 0,
  grade = 'N/A',
  date = new Date().toLocaleDateString(),
  certificateId = 'CERT-000000',
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto border-8 border-double border-slate-700 bg-white p-12 text-slate-800 flex flex-col items-center justify-between gap-8 aspect-[1.414/1] relative select-none">
      {/* Corner Borders */}
      <div className="absolute top-4 left-4 right-4 bottom-4 border-2 border-slate-300 pointer-events-none" />

      {/* Certificate Header */}
      <div className="flex flex-col items-center gap-2 text-center mt-4">
        <Shield className="h-10 w-10 text-slate-650" />
        <h2 className="text-sm font-extrabold tracking-widest text-slate-500 uppercase">
          Certificate of Completion
        </h2>
      </div>

      {/* Main body info */}
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="text-xs text-slate-400 italic font-serif">This is to certify that</span>
        <h1 className="text-3xl font-black font-serif text-slate-900 border-b-2 border-slate-200 pb-2 px-12 leading-tight">
          {studentName}
        </h1>
        <span className="text-xs text-slate-400 italic font-serif">has successfully completed the evaluation for</span>
        <h3 className="text-lg font-bold text-slate-800 leading-snug max-w-lg">
          {examTitle}
        </h3>
      </div>

      {/* Scores & Grades metrics */}
      <div className="flex justify-center gap-12 text-center mt-2">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Score</span>
          <span className="text-base font-extrabold text-slate-800">{score}%</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Grade</span>
          <span className="text-base font-extrabold text-slate-800">{grade}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Date</span>
          <span className="text-base font-extrabold text-slate-850">{date}</span>
        </div>
      </div>

      {/* Certificate sign off */}
      <div className="flex justify-between items-end w-full px-12 mt-6">
        <div className="flex flex-col items-center text-center gap-1">
          <div className="h-6 w-32 border-b border-slate-300 font-serif italic text-slate-500 text-xs">
            AdaptiveAI Committee
          </div>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Authorized Signature</span>
        </div>
        <div className="text-right flex flex-col gap-0.5">
          <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Certificate ID</span>
          <span className="text-[10px] font-mono text-slate-600 font-bold">{certificateId}</span>
        </div>
      </div>
    </div>
  );
};
export default CertificatePreview;
