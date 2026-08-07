import nodemailer from 'nodemailer';
import { env } from '../config/env';
import { logger } from '../utils/logger';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT),
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string, html?: string, attachments?: nodemailer.SendMailOptions['attachments']): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: '"AdaptiveAI" <noreply@adaptiveai.com>',
        to,
        subject,
        text,
        html,
        attachments,
      });
      logger.info(`Email sent to ${to}`);
    } catch (error) {
      logger.error('Error sending email:', error);
    }
  }
}

export const emailService = new EmailService();
