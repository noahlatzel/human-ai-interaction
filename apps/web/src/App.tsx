import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AccountPage from './components/AccountPage';
import TaskPage from './components/TaskPage';
import TopicsPage from './components/TopicsPage';
import CalendarPage from './components/CalendarPage';
import DiscoverPage from './components/DiscoverPage';

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
          path="/topics"
          element={
            isAuthenticated ? (
              <TopicsPageWrapper />
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
      onNavigateToTopics={() => navigate('/topics')}
      onNavigateToAccount={() => navigate('/account')}
      onNavigateToCalendar={() => navigate('/calendar')}
      onNavigateToDiscover={() => navigate('/discover')}
      onLogout={onLogout}
    />
  );
}

function CalendarPageWrapper() {
  const navigate = useNavigate();
  
  return (
    <CalendarPage onBackToDashboard={() => navigate('/dashboard')} />
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

function TopicsPageWrapper() {
  const navigate = useNavigate();
  
  return (
    <TopicsPage
      onBackToDashboard={() => navigate('/dashboard')}
      onSelectTopic={(topic) => {
        console.log('Selected topic:', topic);
        navigate('/task');
      }}
    />
  );
}

function DiscoverPageWrapper() {
  const navigate = useNavigate();
  
  return (
    <DiscoverPage onBackToDashboard={() => navigate('/dashboard')} />
  );
}

export default App;
