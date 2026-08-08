
import fs from 'fs';
import path from 'path';
const pdfParse = require('pdf-parse');
import mongoose from 'mongoose';
import { Question } from '../models/Question';
import crypto from 'crypto';

const PDF_DIR = 'C:\\Users\\Sabarni Mukherjee\\.gemini\\antigravity-ide\\brain\\7aef93a3-0a47-4dd5-a7a2-2af07e1e4f84';

import dotenv from 'dotenv';
dotenv.config();

async function connectDB() {
  await mongoose.connect(process.env.MONGO_URI as string);
  console.log('MongoDB Connected');
}

function normalize(text: string): string {
  return text.trim().replace(/\s+/g, ' ');
}

function hashQuestion(domain: string, subject: string, type: string, text: string): string {
  return crypto.createHash('sha256').update(`${domain}|${subject}|${type}|${text}`).digest('hex');
}

const DOMAIN_MAP: any = {
  'CSE-CYBER': 'CSE Cyber Security',
  'CSE-SE': 'CSE Software Engineering',
  'CSE-AIML': 'CSE AI/ML',
  'CSE-DS': 'CSE Data Science',
  'CSE CORE': 'CSE Core',
};

async function processPDF(filePath: string) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  const text = data.text;

  const lines = text.split('\n').map((l: string) => l.trim()).filter((l: string) => l);

  let currentDomain = '';
  let currentSubject = '';
  let currentTopic = '';
  let currentType = 'MCQ'; // default
  let questionNumber = '';

  let qText = '';
  let options: any[] = [];
  let answer = '';
  let explanation = '';

  let state = 'SEARCHING';

  const questions: any[] = [];

  const saveCurrent = () => {
    if (qText && currentDomain && currentSubject) {
      // For MCQ, answer typically has the correct option like "A"
      // the explanation might be present in the rest of the line
      let finalAnswer = normalize(answer);
      let finalExplanation = normalize(explanation);

      if (currentType === 'MCQ') {
        const match = finalAnswer.match(/^([A-D])\)?\s*(.*)/i);
        if (match) {
          finalAnswer = match[1].toUpperCase();
          finalExplanation = match[2];
        }
      }

      questions.push({
        domain: DOMAIN_MAP[currentDomain] || currentDomain,
        subject: currentSubject,
        questionType: currentType,
        questionText: normalize(qText),
        options: options.slice(),
        correctAnswer: finalAnswer,
        answerExplanation: finalExplanation,
        difficulty: 'Medium',
        topic: currentTopic,
        sourceDocument: path.basename(filePath),
        sourceQuestionNumber: questionNumber,
        isActive: true
      });
    }
    qText = '';
    options = [];
    answer = '';
    explanation = '';
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Pattern: 1. Branch: CSE-CYBER | Domain: Cryptography | Topic: Symmetric Encryption
    const headerMatch = line.match(/^(\d+)\.\s*Branch:\s*(.+?)\s*\|\s*Domain:\s*(.+?)\s*\|\s*Topic:\s*(.*)/i);
    if (headerMatch) {
      saveCurrent();
      questionNumber = headerMatch[1];
      currentDomain = headerMatch[2];
      currentSubject = headerMatch[3];
      currentTopic = headerMatch[4];
      state = 'IN_QUESTION';
      continue;
    }

    // Pattern: Branch: CSE-AIML | Domain: MACHINE LEARNING | Topic: INTRODUCTION TO ML
    const altHeaderMatch = line.match(/^Branch:\s*(.+?)\s*\|\s*Domain:\s*(.+?)\s*\|\s*Topic:\s*(.*)/i);
    if (altHeaderMatch) {
      saveCurrent();
      currentDomain = altHeaderMatch[1];
      currentSubject = altHeaderMatch[2];
      currentTopic = altHeaderMatch[3];
      state = 'IN_QUESTION';

      // Look ahead for Q number
      if (i + 1 < lines.length) {
        const qMatch = lines[i + 1].match(/^Q(\d+)\./);
        if (qMatch) {
          questionNumber = qMatch[1];
          i++;
          qText = lines[i].replace(/^Q\d+\.\s*/, '');
        }
      }
      continue;
    }

    // Pattern: Topic: Asymptotic Notation & Complexity Basics
    const topicMatch = line.match(/^Topic:\s*(.*)/i);
    if (topicMatch) {
      currentTopic = topicMatch[1];
      continue;
    }

    // Pattern: • Branch: CSE CORE
    const branchMatch = line.match(/^•?\s*Branch:\s*([^|]+)/i);
    if (branchMatch) {
      currentDomain = branchMatch[1].trim();
      continue;
    }

    // Pattern: • Domain: Algorithm
    const domainMatch = line.match(/^•?\s*Domain:\s*([^|]+)/i);
    if (domainMatch) {
      currentSubject = domainMatch[1].trim();
      continue;
    }

    if (line.match(/^Q(\d+)\./) || line.match(/^(\d+)\./)) {
      saveCurrent();
      const match = line.match(/^(?:Q)?(\d+)\.\s*(.*)/);
      if (match) {
        questionNumber = match[1];
        qText = match[2];
        state = 'IN_QUESTION';
      }
      continue;
    }

    if (line.match(/^Q:/)) {
      qText = line.replace(/^Q:\s*/, '');
      state = 'IN_QUESTION';
      continue;
    }

    if (line.match(/^[A-D]\)/) || line.match(/^[A-D]\./)) {
      state = 'IN_OPTIONS';
    }

    if (line.match(/^Correct:/i) || line.match(/^Answer:/i) || line.match(/^\*\*Answer:/i) || line.match(/^Model Answer:/i)) {
      state = 'IN_ANSWER';
      answer = line.replace(/^(Correct|Answer|\*\*Answer|Model Answer):\s*/i, '').replace(/\*\*$/, '');

      if (line.match(/^Model Answer:/i)) {
        currentType = 'SAQ';
      }
      continue;
    }

    if (line.match(/^SAQs$/i) || line.match(/^Short Answer Questions/i)) {
      currentType = 'SAQ';
      continue;
    }
    if (line.match(/^MCQs$/i) || line.match(/^Multiple Choice Questions/i)) {
      currentType = 'MCQ';
      continue;
    }

    if (state === 'IN_QUESTION') {
      if (qText) qText += ' ' + line;
      else qText = line;
    } else if (state === 'IN_OPTIONS') {
      // Split options on same line if multiple
      const optMatch = line.match(/([A-D])[).]\s*(.*?)(?=(?:[A-D][).])|$)/g);
      if (optMatch && optMatch.length > 1) {
        optMatch.forEach((opt: string) => {
          const parts = opt.match(/([A-D])[).]\s*(.*)/);
          if (parts) {
            options.push({ key: parts[1], text: parts[2].trim() });
          }
        });
      } else {
        const singleOptMatch = line.match(/^([A-D])[).]\s*(.*)/);
        if (singleOptMatch) {
          options.push({ key: singleOptMatch[1], text: singleOptMatch[2].trim() });
        } else if (options.length > 0) {
          options[options.length - 1].text += ' ' + line;
        }
      }
    } else if (state === 'IN_ANSWER') {
      if (answer && !explanation) {
        explanation = line; // append to explanation
      } else {
        explanation += ' ' + line;
      }
    }
  }

  saveCurrent();
  return questions;
}

async function main() {
  await connectDB();

  const files = fs.readdirSync(PDF_DIR).filter(f => f.endsWith('.pdf'));

  let totalMCQ = 0;
  let totalSAQ = 0;
  let skipped = 0;
  let invalid = 0;

  const report: any = {};

  for (const file of files) {
    const filePath = path.join(PDF_DIR, file);
    console.log(`Processing ${file}...`);
    const qs = await processPDF(filePath);

    for (const q of qs) {
      if (!q.domain || !q.subject || !q.questionText) {
        invalid++;
        continue;
      }

      const exists = await Question.findOne({
        domain: q.domain,
        subject: q.subject,
        questionType: q.questionType,
        questionText: q.questionText
      });

      if (exists) {
        skipped++;
        continue;
      }

      await Question.create(q);

      if (!report[q.domain]) report[q.domain] = {};
      if (!report[q.domain][q.subject]) report[q.domain][q.subject] = { MCQ: 0, SAQ: 0 };

      report[q.domain][q.subject][q.questionType]++;

      if (q.questionType === 'MCQ') totalMCQ++;
      if (q.questionType === 'SAQ') totalSAQ++;
    }
  }

  console.log('\n========================================');
  console.log('ADAPTIVEAI QUESTION BANK');
  console.log('========================================\n');

  for (const dom of Object.keys(report)) {
    console.log(dom);
    for (const sub of Object.keys(report[dom])) {
      console.log(`    ${sub}`);
      console.log(`        MCQ: ${report[dom][sub].MCQ}`);
      console.log(`        SAQ: ${report[dom][sub].SAQ}`);
    }
    console.log();
  }

  console.log('========================================');
  console.log(`TOTAL DOMAINS: ${Object.keys(report).length}`);

  let totalSubjects = 0;
  for (const dom of Object.keys(report)) {
    totalSubjects += Object.keys(report[dom]).length;
  }

  console.log(`TOTAL SUBJECTS: ${totalSubjects}`);
  console.log(`TOTAL QUESTIONS: ${totalMCQ + totalSAQ}`);
  console.log(`MCQs: ${totalMCQ}`);
  console.log(`SAQs: ${totalSAQ}`);
  console.log(`Duplicates skipped: ${skipped}`);
  console.log(`Invalid records: ${invalid}`);
  console.log('========================================');

  mongoose.connection.close();
}

main().catch(console.error);
