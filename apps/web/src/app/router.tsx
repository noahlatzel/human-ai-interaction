/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES, getHomeRouteForRole } from '../lib/routes';
import { useAuth } from '../features/auth/hooks/useAuth';
import GuestEntryPage from '../features/auth/pages/GuestEntryPage';
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterStudentPage from '../features/auth/pages/RegisterStudentPage';
import RegisterTeacherPage from '../features/auth/pages/RegisterTeacherPage';
import TeacherLoginPage from '../features/auth/pages/TeacherLoginPage';
import StudentDashboardPage from '../features/student/pages/StudentDashboardPage';
import TeacherDashboardPage from '../features/teacher/pages/TeacherDashboardPage';
import ProblemPage from '../features/problems/pages/ProblemPage';
import App from './App';

type RequireAuthProps = {
  children: ReactNode;
  allowedRoles?: Array<'admin' | 'teacher' | 'student'>;
  allowGuest?: boolean;
};

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center text-slate-600">Loading...</div>
);

function RequireAuth({ children, allowedRoles, allowGuest = true }: RequireAuthProps) {
  const { isAuthenticated, isLoading, state } = useAuth();

  if (isLoading && state.status === 'idle') {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace />;
  }

  const user = state.user;
  if (!user) return <Navigate to={ROUTES.login} replace />;

  if (!allowGuest && user.isGuest) {
    return <Navigate to={ROUTES.login} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={getHomeRouteForRole(user.role)} replace />;
  }

  return <>{children}</>;
}

const PublicOnly = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading, state } = useAuth();

  if (isLoading && state.status === 'idle') {
    return <LoadingScreen />;
  }

  if (isAuthenticated && state.user) {
    return <Navigate to={getHomeRouteForRole(state.user.role)} replace />;
  }

  return <>{children}</>;
};

const HomeRedirect = () => {
  const { isAuthenticated, state } = useAuth();
  if (isAuthenticated && state.user) {
    return <Navigate to={getHomeRouteForRole(state.user.role)} replace />;
  }
  return <Navigate to={ROUTES.login} replace />;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomeRedirect />,
      },
      {
        path: ROUTES.login,
        element: (
          <PublicOnly>
            <LoginPage />
          </PublicOnly>
        ),
      },
      {
        path: ROUTES.teacherLogin,
        element: (
          <PublicOnly>
            <TeacherLoginPage />
          </PublicOnly>
        ),
      },
      {
        path: ROUTES.registerStudent,
        element: (
          <PublicOnly>
            <RegisterStudentPage />
          </PublicOnly>
        ),
      },
      {
        path: ROUTES.registerTeacher,
        element: (
          <PublicOnly>
            <RegisterTeacherPage />
          </PublicOnly>
        ),
      },
      {
        path: ROUTES.guest,
        element: (
          <PublicOnly>
            <GuestEntryPage />
          </PublicOnly>
        ),
      },
      {
        path: ROUTES.dashboard,
        element: (
          <RequireAuth allowGuest>
            <StudentDashboardPage />
          </RequireAuth>
        ),
      },
      {
        path: ROUTES.problem,
        element: (
          <RequireAuth allowGuest>
            <ProblemPage />
          </RequireAuth>
        ),
      },
      {
        path: ROUTES.teacherDashboard,
        element: (
          <RequireAuth allowedRoles={['teacher', 'admin']} allowGuest={false}>
            <TeacherDashboardPage />
          </RequireAuth>
        ),
      },
      {
        path: '*',
        element: <HomeRedirect />,
      },
    ],
  },
]);

export default router;
