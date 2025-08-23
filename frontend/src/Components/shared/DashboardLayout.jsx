import React, { useState } from 'react';
import { 
  Home, 
  BookOpen, 
  ChevronRight, 
  Bell,
  Settings,
  Users,
  Menu,
  X,
  BookMarked,
  FileText,
  BarChart3,
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

  // Clean color scheme based on role (inspired by Kartable)
  const roleColors = {
    admin: {
      primary: 'bg-blue-600',
      active: 'bg-blue-50 text-blue-700',
      activeIcon: 'text-blue-600',
      hover: 'hover:bg-gray-100'
    },
    student: {
      primary: 'bg-green-600',
      active: 'bg-green-50 text-green-700',
      activeIcon: 'text-green-600',
      hover: 'hover:bg-gray-100'
    }
  };

  const colors = roleColors[userRole];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Clean and minimal */}
      <aside className={`
        ${isSidebarOpen ? 'w-64' : 'w-16'} 
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
        {/* Simple header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className={`w-10 h-10 ${colors.primary} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <span className="text-white font-bold text-lg">K</span>
              </div>
              {isSidebarOpen && (
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl font-bold text-gray-900 truncate">Kartable</h1>
                  <p className="text-xs text-gray-500 truncate">
                    {userRole === 'admin' ? 'Administration' : 'Espace Étudiant'}
                  </p>
                </div>
              )}
            </div>

            {/* Single unified toggle button with proper spacing */}
            <div className="flex-shrink-0 ml-3">
              <button
                onClick={() => {
                  if (window.innerWidth >= 1024) {
                    setIsSidebarOpen(!isSidebarOpen);
                  } else {
                    setIsMobileMenuOpen(false);
                  }
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className={`w-4 h-4 text-gray-500 transition-transform ${!isSidebarOpen ? 'rotate-0' : 'rotate-180'} lg:block hidden`} />
                <X className="w-4 h-4 text-gray-500 lg:hidden block" />
              </button>
            </div>
          </div>
        </div>

        {/* Clean navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.id}>
                <a 
                  href={item.href}
                  className={`
                    flex items-center rounded-lg transition-colors relative group
                    ${isSidebarOpen 
                      ? 'px-3 py-3' 
                      : 'p-3 justify-center'
                    }
                    ${currentPage === item.id 
                      ? colors.active
                      : `text-gray-700 ${colors.hover}`
                    }
                  `}
                  title={!isSidebarOpen ? item.label : undefined}
                >
                  <item.icon className={`w-5 h-5 ${
                    currentPage === item.id 
                      ? colors.activeIcon 
                      : 'text-gray-500'
                  }`} />
                  {isSidebarOpen && (
                    <span className="ml-3 font-medium">
                      {item.label}
                    </span>
                  )}
                  
                  {/* Tooltip for collapsed sidebar */}
                  {!isSidebarOpen && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                      {item.label}
                      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Simple user section */}
        {isSidebarOpen ? (
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className={`w-8 h-8 ${colors.primary} rounded-full flex items-center justify-center text-white font-medium text-sm`}>
                {userName.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500 capitalize">{userRole}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 border-t border-gray-100">
            <div className="flex justify-center">
              <div className={`w-10 h-10 ${colors.primary} rounded-full flex items-center justify-center text-white font-medium text-sm`}>
                {userName.charAt(0)}
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Clean header */}
        <header className="bg-white border-b border-gray-200">
          <div className="px-6 py-4 flex items-center justify-between">
            {/* Page title - clean and simple */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{pageTitle}</h2>
              {pageSubtitle && (
                <p className="text-sm text-gray-600">{pageSubtitle}</p>
              )}
            </div>
            
            {/* Minimal right section */}
            <div className="flex items-center gap-3">
              {/* Simple notification */}
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              {/* Simple user avatar */}
              <div className={`w-8 h-8 ${colors.primary} rounded-full flex items-center justify-center text-white font-medium text-sm`}>
                {userName.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Content area */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;