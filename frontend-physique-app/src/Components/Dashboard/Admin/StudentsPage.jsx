import React, { useState } from 'react';
import { 
  ChevronRight, 
  Clock, 
  Filter,
  Grid,
  List,
  Users,
  FileText,
  TrendingUp,
  Activity
} from 'lucide-react';
import DashboardLayout from '../../shared/DashboardLayout';

const StudentsPage = () => {
  const [activeView, setActiveView] = useState('grid');
  const [selectedFilter, setSelectedFilter] = useState('tous');

  // Données exemple pour les étudiants
  const students = [
    {
      id: 1,
      name: "Sophie Martin",
      level: "Seconde",
      courses: ["Physique-Chimie", "Mathématiques"],
      progress: 75,
      lastActivity: "Il y a 2 heures",
      avatar: "SM"
    },
    {
      id: 2,
      name: "Lucas Dubois",
      level: "Première",
      courses: ["Physique-Chimie", "SVT"],
      progress: 82,
      lastActivity: "Il y a 5 heures",
      avatar: "LD"
    },
    {
      id: 3,
      name: "Emma Bernard",
      level: "Terminale",
      courses: ["Physique-Chimie Spé", "Mathématiques"],
      progress: 91,
      lastActivity: "Il y a 1 jour",
      avatar: "EB"
    },
    {
      id: 4,
      name: "Thomas Petit",
      level: "Seconde",
      courses: ["Physique-Chimie"],
      progress: 68,
      lastActivity: "Il y a 3 jours",
      avatar: "TP"
    },
    {
      id: 5,
      name: "Marie Durand",
      level: "Première",
      courses: ["Physique-Chimie", "Mathématiques", "SVT"],
      progress: 88,
      lastActivity: "Il y a 30 minutes",
      avatar: "MD"
    },
    {
      id: 6,
      name: "Alexandre Moreau",
      level: "Terminale",
      courses: ["Physique-Chimie Spé"],
      progress: 95,
      lastActivity: "Il y a 1 heure",
      avatar: "AM"
    }
  ];

  const stats = [
    { label: "Total étudiants", value: "124", icon: Users, color: "bg-blue-500" },
    { label: "Actifs cette semaine", value: "89", icon: Activity, color: "bg-green-500" },
    { label: "Progression moyenne", value: "76%", icon: TrendingUp, color: "bg-purple-500" },
    { label: "Devoirs rendus", value: "456", icon: FileText, color: "bg-orange-500" }
  ];

  return (
    <DashboardLayout
      currentPage="students"
      pageTitle="Gestion des Étudiants"
      pageSubtitle="Physique-Chimie Seconde"
      userName="PR"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <div className={`w-10 h-10 lg:w-12 lg:h-12 ${stat.color} bg-opacity-10 rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 lg:w-6 lg:h-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-xl lg:text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs lg:text-sm text-gray-600 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters and View Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 lg:gap-4 w-full sm:w-auto">
          <select 
            className="w-full sm:w-auto px-3 lg:px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            <option value="tous">Tous les niveaux</option>
            <option value="seconde">Seconde</option>
            <option value="premiere">Première</option>
            <option value="terminale">Terminale</option>
          </select>
          <button className="w-full sm:w-auto px-3 lg:px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
            <Filter className="w-4 h-4" />
            Filtres avancés
          </button>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <button 
            onClick={() => setActiveView('grid')}
            className={`p-2 rounded ${activeView === 'grid' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setActiveView('list')}
            className={`p-2 rounded ${activeView === 'list' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Students Grid/List */}
      {activeView === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {students.map((student) => (
            <div key={student.id} className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm lg:text-base">
                  {student.avatar}
                </div>
                <span className="px-2 lg:px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  Actif
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 text-sm lg:text-base">{student.name}</h3>
              <p className="text-xs lg:text-sm text-gray-600 mb-3">{student.level}</p>
              
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Progression</span>
                    <span className="font-medium">{student.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${student.progress}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  {student.lastActivity}
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex flex-wrap gap-1">
                  {student.courses.map((course, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Étudiant
                </th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Niveau
                </th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cours
                </th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progression
                </th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernière activité
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium text-xs lg:text-sm">
                        {student.avatar}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{student.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{student.level}</span>
                  </td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4">
                    <div className="flex flex-wrap gap-1">
                      {student.courses.map((course, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {course}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-20 lg:w-24 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-900">{student.progress}%</span>
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-500">
                    {student.lastActivity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
};

export default StudentsPage;