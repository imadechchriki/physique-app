import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";

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

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Routes ADMIN */}
        <Route path="/admin/dashboard" element={<DashboardHome />} />
        <Route path="/admin/students" element={<StudentsPage />} />
        <Route
          path="/admin/courses"
          element={
            <DashboardLayout
              currentPage="courses"
              pageTitle="Gestion des Cours"
              pageSubtitle="Administration des contenus pédagogiques"
              userName="Admin"
              userRole="admin"
            >
              <AdminCourses />
            </DashboardLayout>
          }
        />
        <Route
          path="/admin/exams"
          element={
            <DashboardLayout
              currentPage="exams"
              pageTitle="Gestion des Examens"
              pageSubtitle="Administration des examens et évaluations"
              userName="Admin"
              userRole="admin"
            >
              <AdminExamsPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/admin/quizzes"
          element={
            <DashboardLayout
              currentPage="quizzes"
              pageTitle="Gestion des Quiz"
              pageSubtitle="Administration des quiz et évaluations rapides"
              userName="Admin"
              userRole="admin"
            >
              <AdminQuizzesPage />
            </DashboardLayout>
          }
        />
        <Route path="/admin/analytics" element={<AnalyticsPage />} />
        <Route
          path="/admin/profile"
          element={<ProfilePage userRole="admin" />}
        />

        {/* Routes STUDENT */}
        <Route path="/student/dashboard" element={<StudentDashboardHome />} />
        <Route
          path="/student/courses"
          element={
            <DashboardLayout
              currentPage="courses"
              pageTitle="Mes Cours"
              pageSubtitle="Accédez à vos contenus pédagogiques"
              userName="Étudiant"
              userRole="student"
            >
              <StudentCourses />
            </DashboardLayout>
          }
        />
        <Route
          path="/student/exams"
          element={
            <DashboardLayout
              currentPage="exams"
              pageTitle="Mes Examens"
              pageSubtitle="Consultez et passez vos examens"
              userName="Étudiant"
              userRole="student"
            >
              <StudentExams />
            </DashboardLayout>
          }
        />
        <Route
          path="/student/quizzes"
          element={
            <DashboardLayout
              currentPage="quizzes"
              pageTitle="Mes Quiz"
              pageSubtitle="Entraînez-vous avec nos quiz"
              userName="Étudiant"
              userRole="student"
            >
              <StudentQuizzes />
            </DashboardLayout>
          }
        />
        <Route
          path="/student/profile"
          element={<ProfilePage userRole="student" />}
        />

        {/* Routes de redirection par défaut */}
        <Route
          path="/dashboard"
          element={<Navigate to="/admin/dashboard" replace />}
        />

        {/* Routes de compatibilité (ancien système) */}
        <Route
          path="/Dashboard"
          element={<Navigate to="/admin/dashboard" replace />}
        />
        <Route
          path="/Students"
          element={<Navigate to="/admin/students" replace />}
        />
        <Route
          path="/courses"
          element={<Navigate to="/student/courses" replace />}
        />
        <Route
          path="/exams"
          element={<Navigate to="/student/exams" replace />}
        />
        <Route
          path="/quizzes"
          element={<Navigate to="/student/quizzes" replace />}
        />
      </Routes>
    </Router>
  );
}
