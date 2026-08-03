import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Layouts
import { AuthLayout } from './layouts/AuthLayout';
import { MainLayout } from './layouts/MainLayout';
import { ExamLayout } from './layouts/ExamLayout';
import { BlankLayout } from './layouts/BlankLayout';

// Pages
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { Dashboard } from './pages/Dashboard';
import { Exam } from './pages/Exam';
import { Result } from './pages/Result';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { QuestionBankPage } from './pages/QuestionBankPage';
import { ExamSchedulerPage } from './pages/ExamSchedulerPage';
import { LiveMonitorPage } from './pages/LiveMonitorPage';
import { GradeReviewPage } from './pages/GradeReviewPage';
import { UserManagementPage } from './pages/UserManagementPage';
import { QuestionGenerator } from './pages/admin/QuestionGenerator';
import { StudentExams } from './pages/StudentExams';
import { StudentResults } from './pages/StudentResults';
import { NotFound } from './pages/NotFound';

// Protected Route Guard
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Public Route Guard (prevents logged in users from visiting Login/Register)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export const App = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route element={<PublicRoute><AuthLayout /></PublicRoute>}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Protected Dashboard & Core Routes */}
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/result/:sessionId" element={<Result />} />

        {/* Student Specific Routes */}
        <Route path="/student/exams" element={
          <ProtectedRoute allowedRoles={['student', 'admin']}>
            <StudentExams />
          </ProtectedRoute>
        } />
        <Route path="/student/results" element={
          <ProtectedRoute allowedRoles={['student', 'admin']}>
            <StudentResults />
          </ProtectedRoute>
        } />

        {/* Teacher Specific Routes */}
        <Route
          path="/teacher/question-bank"
          element={
            <ProtectedRoute allowedRoles={['teacher', 'admin']}>
              <QuestionBankPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/scheduler"
          element={
            <ProtectedRoute allowedRoles={['teacher', 'admin']}>
              <ExamSchedulerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/monitor"
          element={
            <ProtectedRoute allowedRoles={['teacher', 'admin']}>
              <LiveMonitorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/grade-review"
          element={
            <ProtectedRoute allowedRoles={['teacher', 'admin']}>
              <GradeReviewPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Specific Routes */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UserManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/generator"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <QuestionGenerator />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/subjects" element={<Navigate to="/dashboard" />} />
        <Route path="/admin/analytics" element={<Navigate to="/dashboard" />} />
        <Route path="/admin/audit-logs" element={<Navigate to="/dashboard" />} />
      </Route>

      {/* Fullscreen Exam Layout */}
      <Route element={<ProtectedRoute><ExamLayout /></ProtectedRoute>}>
        <Route path="/exam/:sessionId" element={<Exam />} />
      </Route>

      {/* Fallback routes */}
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
