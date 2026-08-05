import { Request, Response } from 'express';
import { generateCertificateLogic } from '../services/certificate.service';
import { generateCertificatePDF } from '../services/pdfGenerator.service';
import { Certificate } from '../models/Certificate';
import { emailService } from '../services/emailService';
import { logger } from '../utils/logger';

export const generateCertificate = async (req: Request, res: Response) => {
  try {
    const { 
      examId, studentName, studentEmail, examName, subject, 
      totalQuestions, correctAnswers, wrongAnswers, skippedAnswers, 
      timeTaken, difficultyReached, topicPerformance 
    } = req.body;
    
    // @ts-ignore
    const userId = req.user.userId; // From auth middleware

    const certificate = await generateCertificateLogic({
      userId,
      examId,
      studentName,
      studentEmail,
      examName,
      subject,
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      skippedAnswers,
      timeTaken,
      difficultyReached,
      topicPerformance
    });

    if (!certificate) {
      return res.status(400).json({ success: false, message: 'Certificate Not Eligible' });
    }

    // Generate PDF in background and send email
    try {
      const pdfBuffer = await generateCertificatePDF(certificate);
      await emailService.sendEmail(
        studentEmail,
        'Your AdaptiveAI Certificate of Completion',
        `Congratulations ${studentName}! You scored ${certificate.percentage.toFixed(2)}% in ${examName}.`,
        undefined,
        [{
          filename: `${certificate.certificateId}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }]
      );
    } catch (pdfErr) {
      logger.error('Error generating/sending PDF', pdfErr);
    }

    res.status(201).json({ success: true, certificate });
  } catch (error) {
    logger.error('Error in generateCertificate', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getMyCertificates = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user.userId;
    const certificates = await Certificate.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, certificates });
  } catch (error) {
    logger.error('Error getting my certificates', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getCertificateById = async (req: Request, res: Response) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }
    res.status(200).json({ success: true, certificate });
  } catch (error) {
    logger.error('Error getting certificate', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const verifyCertificate = async (req: Request, res: Response) => {
  try {
    const certificate = await Certificate.findOne({ certificateId: req.params.certificateId });
    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }
    res.status(200).json({ success: true, certificate });
  } catch (error) {
    logger.error('Error verifying certificate', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const downloadCertificate = async (req: Request, res: Response) => {
  try {
    const certificate = await Certificate.findOne({ certificateId: req.params.certificateId });
    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }
    const pdfBuffer = await generateCertificatePDF(certificate);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${certificate.certificateId}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    logger.error('Error downloading certificate', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getAdminCertificates = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    let query: any = {};
    if (search) {
      query = {
        $or: [
          { studentName: { $regex: search, $options: 'i' } },
          { studentEmail: { $regex: search, $options: 'i' } },
          { certificateId: { $regex: search, $options: 'i' } },
          { examName: { $regex: search, $options: 'i' } },
        ]
      };
    }
    const certificates = await Certificate.find(query).sort({ createdAt: -1 });
    
    // Stats for admin dashboard
    const totalCertificates = await Certificate.countDocuments();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCertificates = await Certificate.countDocuments({ createdAt: { $gte: today } });

    res.status(200).json({ 
      success: true, 
      certificates,
      stats: { totalCertificates, todayCertificates }
    });
  } catch (error) {
    logger.error('Error getting admin certificates', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteCertificate = async (req: Request, res: Response) => {
  try {
    await Certificate.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Certificate deleted' });
  } catch (error) {
    logger.error('Error deleting certificate', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
