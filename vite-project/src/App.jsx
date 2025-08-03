import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Login from "./Components/auth/Login";
import Signup from "./Components/auth/Signup";
import Home from "./Home";
import DashboardLayout from "./Components/Dashboard/DashboardLayout";
import DashboardHome from "./Components/Dashboard/DashboardHome";
import StudentsPage from "./Components/Dashboard/StudentsPage";

// Pages supplémentaires (vous pouvez les créer dans des fichiers séparés)
const CoursesPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Courses</h1>
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <p className="text-gray-600">Page des cours en construction...</p>
    </div>
  </div>
);

const ExamsPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Exams</h1>
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <p className="text-gray-600">Page des examens en construction...</p>
    </div>
  </div>
);

const QuizzesPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Quizzes</h1>
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <p className="text-gray-600">Page des quiz en construction...</p>
    </div>
  </div>
);

const ExercisesPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Exercises</h1>
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <p className="text-gray-600">Page des exercices en construction...</p>
    </div>
  </div>
);

const AnalyticsPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Analytics</h1>
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <p className="text-gray-600">Page d'analytics en construction...</p>
    </div>
  </div>
);

const SchedulePage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Schedule</h1>
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <p className="text-gray-600">Page de planning en construction...</p>
    </div>
  </div>
);

const ProfilePage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile</h1>
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <p className="text-gray-600">Page de profil en construction...</p>
    </div>
  </div>
);

const SettingsPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Settings</h1>
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <p className="text-gray-600">Page de paramètres en construction...</p>
    </div>
  </div>
);

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        
        {/* Routes du dashboard avec layout */}
        <Route path="/Dashboard" element={
          <DashboardLayout>
            <DashboardHome />
          </DashboardLayout>
        } />
        
        <Route path="/Students" element={
          <DashboardLayout>
            <StudentsPage />
          </DashboardLayout>
        } />
        
        <Route path="/courses" element={
          <DashboardLayout>
            <CoursesPage />
          </DashboardLayout>
        } />
        
        <Route path="/exams" element={
          <DashboardLayout>
            <ExamsPage />
          </DashboardLayout>
        } />
        
        <Route path="/quizzes" element={
          <DashboardLayout>
            <QuizzesPage />
          </DashboardLayout>
        } />
        
        <Route path="/exercises" element={
          <DashboardLayout>
            <ExercisesPage />
          </DashboardLayout>
        } />
        
        <Route path="/analytics" element={
          <DashboardLayout>
            <AnalyticsPage />
          </DashboardLayout>
        } />
        
        <Route path="/schedule" element={
          <DashboardLayout>
            <SchedulePage />
          </DashboardLayout>
        } />
        
        <Route path="/profile" element={
          <DashboardLayout>
            <ProfilePage />
          </DashboardLayout>
        } />
        
        <Route path="/settings" element={
          <DashboardLayout>
            <SettingsPage />
          </DashboardLayout>
        } />
      </Routes>
    </Router>
  );
}