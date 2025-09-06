// src/App.jsx - Version complète avec Error Boundary
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";

// Context et Error Boundary
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ErrorBoundary from "./components/shared/ErrorBoundary";

// Auth Components
import Login from "./Components/auth/Login";
import Signup from "./Components/auth/Signup";

// Public Components
import Home from "./Home";

// Layout
import DashboardLayout from "./Components/shared/DashboardLayout";

// Admin Components
import DashboardHome from "./Components/Dashboard/Admin/DashboardHome";
import StudentsPage from "./Components/Dashboard/Admin/StudentsPage";
import AdminCourses from "./Components/Dashboard/Admin/AdminCourses";
import AdminExamsPage from "./Components/Dashboard/Admin/AdminExamsPage";
import AdminQuizzesPage from "./Components/Dashboard/Admin/AdminQuizzesPage";
import AnalyticsPage from "./Components/Dashboard/Admin/AnalyticsPage";

// Student Components
import StudentDashboardHome from "./Components/Dashboard/Students/StudentDashboardHome";
import StudentCourses from "./Components/Dashboard/Students/Courses";
import StudentExams from "./Components/Dashboard/students/Exams";
import StudentQuizzes from "./Components/Dashboard/Students/Quizzes";

// Shared Components
import ProfilePage from "./Components/shared/ProfilePage";
import LoadingSpinner from "./Components/shared/LoadingSpinner";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, isInitialized, user } = useAuth();

  if (!isInitialized) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access if roles are specified
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user role
    const redirectPath = user.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isInitialized, user } = useAuth();

  if (!isInitialized) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated && user) {
    // Redirect to appropriate dashboard based on user role
    const redirectPath = user.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

// Role-based Dashboard Layout Wrapper
const DashboardLayoutWrapper = ({ 
  currentPage, 
  pageTitle, 
  pageSubtitle, 
  allowedRoles = [],
  children 
}) => {
  const { user } = useAuth();

  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <DashboardLayout
        currentPage={currentPage}
        pageTitle={pageTitle}
        pageSubtitle={pageSubtitle}
        userName={user?.fullName || user?.firstName || 'Utilisateur'}
        userRole={user?.role?.toLowerCase() || 'user'}
      >
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
};

// Main App Routes
const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/" element={<Home />} />
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      <Route 
        path="/signup" 
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        } 
      />

      {/* Routes ADMIN */}
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <DashboardHome />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/students" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <StudentsPage />
          </ProtectedRoute>
        } 
      />
      <Route
        path="/admin/courses"
        element={
          <DashboardLayoutWrapper
            currentPage="courses"
            pageTitle="Gestion des Cours"
            pageSubtitle="Administration des contenus pédagogiques"
            allowedRoles={['ADMIN']}
          >
            <AdminCourses />
          </DashboardLayoutWrapper>
        }
      />
      <Route
        path="/admin/exams"
        element={
          <DashboardLayoutWrapper
            currentPage="exams"
            pageTitle="Gestion des Examens"
            pageSubtitle="Administration des examens et évaluations"
            allowedRoles={['ADMIN']}
          >
            <AdminExamsPage />
          </DashboardLayoutWrapper>
        }
      />
      <Route
        path="/admin/quizzes"
        element={
          <DashboardLayoutWrapper
            currentPage="quizzes"
            pageTitle="Gestion des Quiz"
            pageSubtitle="Administration des quiz et évaluations rapides"
            allowedRoles={['ADMIN']}
          >
            <AdminQuizzesPage />
          </DashboardLayoutWrapper>
        }
      />
      <Route 
        path="/admin/analytics" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AnalyticsPage />
          </ProtectedRoute>
        } 
      />
      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <ProfilePage userRole="admin" />
          </ProtectedRoute>
        }
      />

      {/* Routes STUDENT */}
      <Route 
        path="/student/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <StudentDashboardHome />
          </ProtectedRoute>
        } 
      />
      <Route
        path="/student/courses"
        element={
          <DashboardLayoutWrapper
            currentPage="courses"
            pageTitle="Mes Cours"
            pageSubtitle="Accédez à vos contenus pédagogiques"
            allowedRoles={['STUDENT']}
          >
            <StudentCourses />
          </DashboardLayoutWrapper>
        }
      />
      <Route
        path="/student/exams"
        element={
          <DashboardLayoutWrapper
            currentPage="exams"
            pageTitle="Mes Examens"
            pageSubtitle="Consultez et passez vos examens"
            allowedRoles={['STUDENT']}
          >
            <StudentExams />
          </DashboardLayoutWrapper>
        }
      />
      <Route
        path="/student/quizzes"
        element={
          <DashboardLayoutWrapper
            currentPage="quizzes"
            pageTitle="Mes Quiz"
            pageSubtitle="Entraînez-vous avec nos quiz"
            allowedRoles={['STUDENT']}
          >
            <StudentQuizzes />
          </DashboardLayoutWrapper>
        }
      />
      <Route
        path="/student/profile"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <ProfilePage userRole="student" />
          </ProtectedRoute>
        }
      />

      {/* Routes de redirection dynamiques basées sur le rôle */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Navigate 
              to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard'} 
              replace 
            />
          </ProtectedRoute>
        }
      />

      {/* Routes de compatibilité (ancien système) */}
      <Route
        path="/Dashboard"
        element={
          <ProtectedRoute>
            <Navigate 
              to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard'} 
              replace 
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Students"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <Navigate to="/admin/students" replace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses"
        element={
          <ProtectedRoute>
            <Navigate 
              to={user?.role === 'ADMIN' ? '/admin/courses' : '/student/courses'} 
              replace 
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/exams"
        element={
          <ProtectedRoute>
            <Navigate 
              to={user?.role === 'ADMIN' ? '/admin/exams' : '/student/exams'} 
              replace 
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quizzes"
        element={
          <ProtectedRoute>
            <Navigate 
              to={user?.role === 'ADMIN' ? '/admin/quizzes' : '/student/quizzes'} 
              replace 
            />
          </ProtectedRoute>
        }
      />

      {/* Route par défaut - Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Main App Component
export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <div className="App">
            <AppRoutes />
          </div>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}