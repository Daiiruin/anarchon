import { createBrowserRouter, Navigate } from 'react-router-dom';
import { QgLayout } from './QgLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { LoginPage } from '@/features/auth/LoginPage';
import { RegisterPage } from '@/features/auth/RegisterPage';

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
          // Remplacé par la vraie page catalogue à la Task 4.
          {
            path: '/cases',
            element: <div className="p-6">Catalogue à venir…</div>,
          },
        ],
      },
    ],
  },
]);
