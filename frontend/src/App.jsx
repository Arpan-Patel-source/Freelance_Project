import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import JobProposals from './pages/JobProposals';
import PostJob from './pages/PostJob';
import MyJobs from './pages/MyJobs';
import Messages from './pages/Messages';
import Contracts from './pages/Contracts';
import ContractDetail from './pages/ContractDetail';
import Notifications from './pages/Notifications';
import GoogleAuthCallback from './pages/GoogleAuthCallback';
import { NotificationContainer } from './components/NotificationToast';
import useAuthStore from './store/useAuthStore';
import useIdleTimeout from './hooks/useIdleTimeout';
import { useSocketNotifications } from './hooks/useSocketNotifications';

function PrivateRoute({ children }) {
  const { isAuthenticated, user, token } = useAuthStore();
  console.log('PrivateRoute check:', {
    isAuthenticated,
    hasUser: !!user,
    hasToken: !!token,
    sessionToken: !!sessionStorage.getItem('token')
  });
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function ClientRoute({ children }) {
  const { isAuthenticated, user } = useAuthStore();
  return isAuthenticated && user?.role === 'client' ? children : <Navigate to="/dashboard" />;
}

function App() {
  // Enable automatic logout after 10 minutes of inactivity
  useIdleTimeout();

  // Initialize Socket.IO notifications
  const { toastNotifications, removeToast } = useSocketNotifications();

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Toast Notifications */}
        <NotificationContainer
          notifications={toastNotifications}
          onClose={removeToast}
        />

        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/auth/google/success" element={<GoogleAuthCallback />} />
            <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route
              path="/jobs/:id/proposals"
              element={
                <ClientRoute>
                  <JobProposals />
                </ClientRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/post-job"
              element={
                <ClientRoute>
                  <PostJob />
                </ClientRoute>
              }
            />
            <Route
              path="/my-jobs"
              element={
                <ClientRoute>
                  <MyJobs />
                </ClientRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <PrivateRoute>
                  <Messages />
                </PrivateRoute>
              }
            />
            <Route
              path="/contracts"
              element={
                <PrivateRoute>
                  <Contracts />
                </PrivateRoute>
              }
            />
            <Route
              path="/contracts/:id"
              element={
                <PrivateRoute>
                  <ContractDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <PrivateRoute>
                  <Notifications />
                </PrivateRoute>
              }
            />
          </Routes>
        </ErrorBoundary>
      </div>
    </Router>
  );
}

export default App;
