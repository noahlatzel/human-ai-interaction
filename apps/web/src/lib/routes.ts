export const ROUTES = {
  login: '/login',
  teacherLogin: '/teacher-login',
  registerStudent: '/register/student',
  registerTeacher: '/register/teacher',
  guest: '/guest',
  dashboard: '/dashboard',
  admin: '/admin',
  teacherDashboard: '/teacher-dashboard',
  problem: '/tasks/:problemId',
  account: '/account',
  teacherAccount: '/teacher-account',
};

export type AppRouteKey = keyof typeof ROUTES;

export const getHomeRouteForRole = (role?: 'admin' | 'teacher' | 'student') => {
  if (role === 'teacher') return ROUTES.teacherDashboard;
  if (role === 'admin') return ROUTES.admin;
  return ROUTES.dashboard;
};

export const getProblemRoute = (problemId: string) =>
  ROUTES.problem.replace(':problemId', problemId);
