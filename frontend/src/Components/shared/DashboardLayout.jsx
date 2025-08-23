import React, { useState } from 'react';
import { 
  Home, 
  BookOpen, 
  Search, 
  User, 
  ChevronRight, 
  Bell,
  Settings,
  Users,
  Menu,
  X,
  BookMarked,
  FileText,
  BarChart3,
  Calendar,
  UserCircle,
  GraduationCap,
  ClipboardList
} from 'lucide-react';

const DashboardLayout = ({ 
  children, 
  currentPage = 'home',
  pageTitle = 'Tableau de bord',
  pageSubtitle = '',
  userName = 'User',
  userRole = 'admin' // 'admin' or 'student'
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Navigation items based on user role
  const adminNavigationItems = [
    { id: 'home', label: 'Tableau de bord', icon: Home, href: '/admin/dashboard' },
    { id: 'students', label: 'Étudiants', icon: Users, href: '/admin/students' },
    { id: 'courses', label: 'Gestion Cours', icon: BookMarked, href: '/admin/courses' },
    { id: 'exams', label: 'Gestion Examens', icon: FileText, href: '/admin/exams' },
    { id: 'quizzes', label: 'Gestion Quiz', icon: ClipboardList, href: '/admin/quizzes' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
    { id: 'profile', label: 'Profil', icon: UserCircle, href: '/admin/profile' }
  ];

  const studentNavigationItems = [
    { id: 'home', label: 'Tableau de bord', icon: Home, href: '/student/dashboard' },
    { id: 'courses', label: 'Mes Cours', icon: BookOpen, href: '/student/courses' },
    { id: 'exams', label: 'Mes Examens', icon: FileText, href: '/student/exams' },
    { id: 'quizzes', label: 'Mes Quiz', icon: ClipboardList, href: '/student/quizzes' },
    { id: 'profile', label: 'Profil', icon: UserCircle, href: '/student/profile' }
  ];

  const navigationItems = userRole === 'admin' ? adminNavigationItems : studentNavigationItems;

  // Color scheme based on role
  const roleColors = {
    admin: {
      primary: 'from-blue-500 to-blue-600',
      text: 'from-blue-600 to-blue-700',
      active: 'bg-blue-50 text-blue-600',
      activeIcon: 'text-blue-600',
      activeIndicator: 'bg-blue-600',
      hover: 'hover:bg-gray-50'
    },
    student: {
      primary: 'from-green-500 to-green-600',
      text: 'from-green-600 to-green-700',
      active: 'bg-green-50 text-green-600',
      activeIcon: 'text-green-600',
      activeIndicator: 'bg-green-600',
      hover: 'hover:bg-gray-50'
    }
  };

  const colors = roleColors[userRole];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Overlay pour mobile */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        ${isSidebarOpen ? 'w-64' : 'w-20'} 
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        fixed lg:relative
        h-full
        bg-white 
        border-r border-gray-200 
        transition-all duration-300 
        flex flex-col
        z-50
      `}>
        {/* Logo et contrôles */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          {/* Logo moderne avec gradient basé sur le rôle */}
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 bg-gradient-to-br ${colors.primary} rounded-xl flex items-center justify-center shadow-lg`}>
              <span className="text-white font-bold text-lg">K</span>
            </div>
            {isSidebarOpen && (
              <div className="transition-opacity duration-200">
                <h1 className={`text-xl font-bold bg-gradient-to-r ${colors.text} bg-clip-text text-transparent`}>
                  Kartable
                </h1>
                <p className="text-xs text-gray-500 -mt-1">
                  {userRole === 'admin' ? 'Administration' : 'Espace Étudiant'}
                </p>
              </div>
            )}
          </div>

          {/* Bouton toggle amélioré (desktop uniquement) */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden lg:flex w-8 h-8 items-center justify-center rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 group"
            title={isSidebarOpen ? "Réduire la sidebar" : "Élargir la sidebar"}
          >
            <ChevronRight className={`w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-all duration-200 ${!isSidebarOpen ? 'rotate-0' : 'rotate-180'}`} />
          </button>
        </div>

        {/* Role badge */}
        {isSidebarOpen && (
          <div className="px-6 py-2">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              userRole === 'admin' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-green-100 text-green-700'
            }`}>
              {userRole === 'admin' ? (
                <>
                  <Settings className="w-3 h-3 mr-1" />
                  Administrateur
                </>
              ) : (
                <>
                  <GraduationCap className="w-3 h-3 mr-1" />
                  Étudiant
                </>
              )}
            </div>
          </div>
        )}

        {/* Navigation améliorée */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navigationItems.map((item) => (
              <li key={item.id}>
                <a 
                  href={item.href}
                  className={`
                    flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative
                    ${currentPage === item.id 
                      ? colors.active
                      : `text-gray-600 ${colors.hover} hover:text-gray-900`
                    }
                  `}
                >
                  <item.icon className={`w-5 h-5 flex-shrink-0 transition-all duration-200 ${
                    currentPage === item.id 
                      ? colors.activeIcon 
                      : 'text-gray-500 group-hover:text-gray-700'
                  }`} />
                  {isSidebarOpen && (
                    <span className={`ml-3 transition-all duration-200 ${
                      currentPage === item.id 
                        ? `font-semibold ${colors.activeIcon}` 
                        : 'text-gray-700 group-hover:text-gray-900'
                    }`}>
                      {item.label}
                    </span>
                  )}
                  {/* Indicateur actif avec couleur basée sur le rôle */}
                  {currentPage === item.id && (
                    <div className={`absolute right-2 w-1.5 h-6 ${colors.activeIndicator} rounded-full`}></div>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* User info section */}
        {isSidebarOpen && (
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
              <div className={`w-8 h-8 bg-gradient-to-br ${colors.primary} rounded-full flex items-center justify-center text-white font-medium text-sm shadow-sm`}>
                {userName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
                <p className="text-xs text-gray-500 capitalize">{userRole}</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header Simplifié */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 lg:px-8 py-4 flex items-center justify-between">
            {/* Menu mobile + Titre */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">{pageTitle}</h2>
                {pageSubtitle && (
                  <p className="text-sm text-gray-600 mt-0.5">{pageSubtitle}</p>
                )}
              </div>
            </div>
            
            {/* Boutons Notifications et Profil */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              
              {/* Avatar utilisateur avec couleur basée sur le rôle */}
              <div className="relative group">
                <div className={`w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br ${colors.primary} rounded-full flex items-center justify-center text-white font-medium text-sm lg:text-base shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200`}>
                  {userName.charAt(0)}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                
                {/* Dropdown menu (optionnel) */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-3 border-b border-gray-100">
                    <p className="font-medium text-gray-900">{userName}</p>
                    <p className="text-sm text-gray-500 capitalize">{userRole}</p>
                  </div>
                  <div className="p-1">
                    <a 
                      href={userRole === 'admin' ? '/admin/profile' : '/student/profile'}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <UserCircle className="w-4 h-4" />
                      Mon Profil
                    </a>
                    <a 
                      href="/logout"
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Déconnexion
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;