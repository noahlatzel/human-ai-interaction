import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './components/Login';
import TeacherLogin from './components/TeacherLogin';
import TeacherDashboard from './components/TeacherDashboard';
import TeacherAccountPage from './components/TeacherAccountPage';
import Dashboard from './components/Dashboard';
import AccountPage from './components/AccountPage';
import TaskPage from './components/TaskPage';
import CalendarPage from './components/CalendarPage';
import DiscoverPage from './components/DiscoverPage';
import TopicDetailPage from './components/TopicDetailPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    console.log('User logged in successfully!');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    console.log('User logged out successfully!');
  };

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )
          }
        />
        <Route
          path="/teacher-login"
          element={
            isAuthenticated ? (
              <Navigate to="/teacher-dashboard" replace />
            ) : (
              <TeacherLogin onLoginSuccess={handleLoginSuccess} />
            )
          }
        />
        <Route
          path="/teacher-dashboard"
          element={
            isAuthenticated ? (
              <TeacherDashboardWrapper onLogout={handleLogout} />
            ) : (
              <Navigate to="/teacher-login" replace />
            )
          }
        />
        <Route
          path="/teacher-account"
          element={
            isAuthenticated ? (
              <TeacherAccountPageWrapper />
            ) : (
              <Navigate to="/teacher-login" replace />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <DashboardWrapper 
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/calendar"
          element={
            isAuthenticated ? (
              <CalendarPageWrapper />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/account"
          element={
            isAuthenticated ? (
              <AccountPageWrapper />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/task"
          element={
            isAuthenticated ? (
              <TaskPageWrapper />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/topic/:topicId"
          element={
            isAuthenticated ? (
              <TopicDetailPageWrapper />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/discover"
          element={
            isAuthenticated ? (
              <DiscoverPageWrapper />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// Wrapper components to use useNavigate hook
function DashboardWrapper({ onLogout }: { onLogout: () => void }) {
  const navigate = useNavigate();
  
  return (
    <Dashboard
      onNavigateToTask={() => navigate('/task')}
      onNavigateToAccount={() => navigate('/account')}
      onNavigateToCalendar={() => navigate('/calendar')}
      onNavigateToDiscover={() => navigate('/discover')}
      onNavigateToTopicDetail={(topicId) => navigate(`/topic/${topicId}`)}
      onLogout={onLogout}
    />
  );
}

function CalendarPageWrapper() {
  const navigate = useNavigate();
  
  return (
    <CalendarPage 
      onBackToDashboard={() => navigate('/dashboard')}
      onNavigateToDashboard={() => navigate('/dashboard')}
      onNavigateToDiscover={() => navigate('/discover')}
      onNavigateToAccount={() => navigate('/account')}
    />
  );
}

function AccountPageWrapper() {
  const navigate = useNavigate();
  
  return (
    <AccountPage onBackToDashboard={() => navigate('/dashboard')} />
  );
}

function TaskPageWrapper() {
  const navigate = useNavigate();
  
  return (
    <TaskPage
      onBackToDashboard={() => navigate('/dashboard')}
      onNextTask={() => console.log('Next task')}
      onSubmit={(data) => console.log('Task submitted:', data)}
    />
  );
}

function TopicDetailPageWrapper() {
  const navigate = useNavigate();
  const { topicId } = useParams<{ topicId: string }>();
  
  return (
    <TopicDetailPage
      topicId={topicId || ''}
      onBackToDashboard={() => navigate('/dashboard')}
      onStartLevel={(topicId, levelId) => {
        console.log('Starting level:', topicId, levelId);
        navigate('/task');
      }}
    />
  );
}

function DiscoverPageWrapper() {
  const navigate = useNavigate();
  
  return (
    <DiscoverPage 
      onBackToDashboard={() => navigate('/dashboard')}
      onNavigateToDashboard={() => navigate('/dashboard')}
      onNavigateToCalendar={() => navigate('/calendar')}
      onNavigateToAccount={() => navigate('/account')}
    />
  );
}

function TeacherDashboardWrapper({ onLogout }: { onLogout: () => void }) {
  const navigate = useNavigate();
  
  return (
    <TeacherDashboard 
      onLogout={onLogout}
      onNavigateToAccount={() => navigate('/teacher-account')}
    />
  );
}

function TeacherAccountPageWrapper() {
  const navigate = useNavigate();
  
  return (
    <TeacherAccountPage onBackToDashboard={() => navigate('/teacher-dashboard')} />
  );
}

export default App;
