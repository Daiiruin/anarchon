import { createBrowserRouter, Navigate } from 'react-router-dom';
import { QgLayout } from './QgLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { LoginPage } from '@/features/auth/LoginPage';
import { RegisterPage } from '@/features/auth/RegisterPage';
import { CasesCataloguePage } from '@/features/cases/CasesCataloguePage';

export const router = createBrowserRouter([
  {
    element: <QgLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/', element: <Navigate to="/cases" replace /> },
          { path: '/cases', element: <CasesCataloguePage /> },
        ],
      },
    ],
  },
]);
