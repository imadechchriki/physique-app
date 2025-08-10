import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Login from "./Components/auth/Login";
import Signup from "./Components/auth/Signup";
import Home from "./Home";
import DashboardLayout from "./Components/Dashboard/DashboardLayout";
import DashboardHome from "./Components/Dashboard/Admin/DashboardHome";
import StudentsPage from "./Components/Dashboard/Admin/StudentsPage";
import Courses from "./Components/Dashboard/students/Courses";
import Exams from "./Components/Dashboard/students/Exams";
// Pages supplémentaires (vous pouvez les créer dans des fichiers séparés)
const ExamsPage = () => (
  <DashboardLayout
    currentPage="exams"
    pageTitle="Examens"
    pageSubtitle="Gestion des examens et évaluations"
    userName="PR"
  >
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <p className="text-gray-600">Page des examens en construction...</p>
    </div>
  </DashboardLayout>
);

const QuizzesPage = () => (
  <DashboardLayout
    currentPage="quizzes"
    pageTitle="Quiz"
    pageSubtitle="Création et gestion des quiz"
    userName="PR"
  >
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <p className="text-gray-600">Page des quiz en construction...</p>
    </div>
  </DashboardLayout>
);

const ExercisesPage = () => (
  <DashboardLayout
    currentPage="exercises"
    pageTitle="Exercices"
    pageSubtitle="Banque d'exercices et devoirs"
    userName="PR"
  >
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <p className="text-gray-600">Page des exercices en construction...</p>
    </div>
  </DashboardLayout>
);

const AnalyticsPage = () => (
  <DashboardLayout
    currentPage="analytics"
    pageTitle="Analytics"
    pageSubtitle="Statistiques et analyses de performance"
    userName="PR"
  >
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <p className="text-gray-600">Page d'analytics en construction...</p>
    </div>
  </DashboardLayout>
);

const SchedulePage = () => (
  <DashboardLayout
    currentPage="schedule"
    pageTitle="Planning"
    pageSubtitle="Calendrier et emploi du temps"
    userName="PR"
  >
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <p className="text-gray-600">Page de planning en construction...</p>
    </div>
  </DashboardLayout>
);

const ProfilePage = () => (
  <DashboardLayout
    currentPage="profile"
    pageTitle="Profil"
    pageSubtitle="Paramètres de profil utilisateur"
    userName="PR"
  >
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <p className="text-gray-600">Page de profil en construction...</p>
    </div>
  </DashboardLayout>
);

const SettingsPage = () => (
  <DashboardLayout
    currentPage="settings"
    pageTitle="Paramètres"
    pageSubtitle="Configuration de l'application"
    userName="PR"
  >
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <p className="text-gray-600">Page de paramètres en construction...</p>
    </div>
  </DashboardLayout>
);

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        
        {/* Routes du dashboard avec layout intégré */}
        <Route path="/Dashboard" element={<DashboardHome />} />
        
        <Route path="/Students" element={<StudentsPage />} />
        
        <Route path="/courses" element={
          <DashboardLayout
            currentPage="courses"
            pageTitle="Cours"
            pageSubtitle="Gestion des contenus pédagogiques"
            userName="PR"
          >
            <Courses />
          </DashboardLayout>
        } />
        
        <Route path="/exams" element={
          <DashboardLayout
            currentPage="exams"
            pageTitle="Examens"
            userName="PR"
          >
            <Exams />
          </DashboardLayout>
        } />
        <Route path="/quizzes" element={<QuizzesPage />} />
        <Route path="/exercises" element={<ExercisesPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Router>
  );
}