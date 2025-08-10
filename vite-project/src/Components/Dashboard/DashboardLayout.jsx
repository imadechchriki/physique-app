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
  UserCircle
} from 'lucide-react';

const DashboardLayout = ({ 
  children, 
  currentPage = 'home',
  pageTitle = 'Tableau de bord',
  pageSubtitle = '',
  userName = 'PR'
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'home', label: 'Tableau de bord', icon: Home, href: '/Dashboard' },
    { id: 'students', label: 'Étudiants', icon: Users, href: '/Students' },
    { id: 'courses', label: 'Cours', icon: BookMarked, href: '/courses' },
    { id: 'exams', label: 'Examens', icon: FileText, href: '/exams' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/analytics' },
    { id: 'schedule', label: 'Planning', icon: Calendar, href: '/schedule' },
    { id: 'profile', label: 'Profil', icon: UserCircle, href: '/profile' }
  ];

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
          {/* Logo moderne avec gradient */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            {isSidebarOpen && (
              <div className="transition-opacity duration-200">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  Kartable
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Plateforme éducative</p>
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
                      ? 'bg-blue-50 text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <item.icon className={`w-5 h-5 flex-shrink-0 transition-all duration-200 ${currentPage === item.id ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
                  {isSidebarOpen && (
                    <span className={`ml-3 transition-all duration-200 ${currentPage === item.id ? 'font-semibold text-blue-600' : 'text-gray-700 group-hover:text-gray-900'}`}>
                      {item.label}
                    </span>
                  )}
                  {/* Indicateur actif */}
                  {currentPage === item.id && (
                    <div className="absolute right-2 w-1.5 h-6 bg-blue-600 rounded-full"></div>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>
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
              
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900">{pageTitle}</h2>
            </div>
            
            {/* Boutons Notifications et Profil */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              
              {/* Avatar utilisateur */}
              <div className="relative group">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm lg:text-base shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200">
                  {userName}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
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