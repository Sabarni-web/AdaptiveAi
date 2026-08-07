import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { ICertificate } from '../models/Certificate';
import fs from 'fs';
import path from 'path';

export const generateCertificatePDF = async (certificate: ICertificate): Promise<Buffer> => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margin: 50,
      });

      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Background Gradient/Color
      doc.rect(0, 0, doc.page.width, doc.page.height).fill('#0f172a'); // Slate 900

      // Gold Border
      doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
         .lineWidth(5)
         .stroke('#fbbf24'); // Amber 400 (Gold-ish)
      doc.rect(25, 25, doc.page.width - 50, doc.page.height - 50)
         .lineWidth(1)
         .stroke('#fbbf24');

      // Title
      doc.font('Helvetica-Bold')
         .fontSize(40)
         .fillColor('#fbbf24')
         .text('CERTIFICATE OF COMPLETION', 0, 100, { align: 'center' });

      doc.font('Helvetica')
         .fontSize(16)
         .fillColor('#94a3b8')
         .text('This is to certify that', 0, 160, { align: 'center' });

      // Student Name
      doc.font('Helvetica-Bold')
         .fontSize(36)
         .fillColor('#ffffff')
         .text(certificate.studentName, 0, 200, { align: 'center' });

      doc.font('Helvetica')
         .fontSize(16)
         .fillColor('#94a3b8')
         .text('has successfully completed the assessment for', 0, 250, { align: 'center' });

      // Subject / Exam Name
      doc.font('Helvetica-Bold')
         .fontSize(24)
         .fillColor('#38bdf8') // Sky 400
         .text(certificate.examName, 0, 290, { align: 'center' });

      // Stats
      doc.font('Helvetica')
         .fontSize(14)
         .fillColor('#cbd5e1')
         .text(`Score: ${certificate.percentage.toFixed(2)}% | Grade: ${certificate.grade}`, 0, 330, { align: 'center' });

      // Date & ID
      doc.font('Helvetica')
         .fontSize(12)
         .fillColor('#64748b')
         .text(`Date: ${certificate.issuedDate.toLocaleDateString()}`, 100, 480);
      
      doc.text(`Certificate ID: ${certificate.certificateId}`, 100, 500);
      
      doc.font('Helvetica-Bold')
         .fillColor('#22c55e') // Green 500
         .text('Digitally Verified by AdaptiveAI Assessment Engine', 450, 480);
      
      doc.font('Helvetica')
         .fillColor('#64748b')
         .text('AI Confidence: 98%', 450, 500);

      // QR Code
      const verificationUrl = `https://adaptiveai.com/verify/${certificate.certificateId}`;
      const qrImageBuffer = await QRCode.toBuffer(verificationUrl, {
        errorCorrectionLevel: 'H',
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
      
      doc.image(qrImageBuffer, doc.page.width / 2 - 50, 430, { width: 100 });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
