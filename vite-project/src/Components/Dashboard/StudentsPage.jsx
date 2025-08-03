import React, { useState } from 'react';
import {
  User,
  Award,
  Clock,
  Star,
  Search,
  Download,
  Eye,
  Edit,
  X,
  GraduationCap,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";

const StudentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedField, setSelectedField] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const studentsData = [
    {
      id: 1,
      firstName: 'Sarah',
      lastName: 'Benali',
      email: 'sarah.benali@université.ma',
      field: 'Physique Mathématique',
      level: 'Master 2',
      school: 'Faculté des Sciences, Université Mohammed V',
      avatar: 'SB',
      score: 92,
      attendance: 96,
      courses: 8,
      status: 'Excellent',
      joinDate: '2023-09-15',
      phone: '+212 6 12 34 56 78'
    },
    {
      id: 2,
      firstName: 'Ahmed',
      lastName: 'El Mansouri',
      email: 'ahmed.mansouri@université.ma',
      field: 'Physique Expérimentale',
      level: 'Master 1',
      school: 'Faculté des Sciences, Université Hassan II',
      avatar: 'AE',
      score: 87,
      attendance: 94,
      courses: 6,
      status: 'Très Bien',
      joinDate: '2023-09-20',
      phone: '+212 6 23 45 67 89'
    },
    {
      id: 3,
      firstName: 'Fatima',
      lastName: 'Zahra',
      email: 'fatima.zahra@université.ma',
      field: 'Physique Théorique',
      level: 'Doctorat',
      school: 'Faculté des Sciences, Université Cadi Ayyad',
      avatar: 'FZ',
      score: 95,
      attendance: 98,
      courses: 12,
      status: 'Excellent',
      joinDate: '2022-10-01',
      phone: '+212 6 34 56 78 90'
    }
  ];

  const fieldColors = {
    'Physique Mathématique': 'bg-blue-50 text-blue-700 border border-blue-200',
    'Physique Expérimentale': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    'Physique Théorique': 'bg-purple-50 text-purple-700 border border-purple-200'
  };

  const statusColors = {
    'Excellent': 'bg-green-50 text-green-700 border border-green-200',
    'Très Bien': 'bg-blue-50 text-blue-700 border border-blue-200',
    'Bien': 'bg-yellow-50 text-yellow-700 border border-yellow-200'
  };

  const getAvatarColor = (field) => {
    switch(field) {
      case 'Physique Mathématique': return 'from-blue-500 to-blue-600';
      case 'Physique Expérimentale': return 'from-emerald-500 to-emerald-600';
      case 'Physique Théorique': return 'from-purple-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const filteredStudents = studentsData.filter(student => {
    const matchesSearch = student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesField = selectedField === 'all' || student.field === selectedField;
    const matchesLevel = selectedLevel === 'all' || student.level === selectedLevel;
    
    return matchesSearch && matchesField && matchesLevel;
  });

  const StatsCard = ({ icon: Icon, title, value, change, color }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <span className={`text-sm font-medium ${change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
            {change}
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-gray-600 text-sm">{title}</p>
    </div>
  );

  const StudentCard = ({ student }) => (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-14 h-14 bg-gradient-to-br ${getAvatarColor(student.field)} rounded-xl flex items-center justify-center shadow-sm`}>
            <span className="text-white font-bold text-lg">{student.avatar}</span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {student.firstName} {student.lastName}
            </h3>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-md text-xs font-medium ${fieldColors[student.field]}`}>
                {student.field}
              </span>
              <span className={`px-2 py-1 rounded-md text-xs font-medium ${statusColors[student.status]}`}>
                {student.status}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <GraduationCap className="w-4 h-4" />
            <span>{student.level}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <Mail className="w-4 h-4" />
            <span className="truncate">{student.email}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-2 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-600">{student.score}%</div>
            <div className="text-xs text-gray-600">Note</div>
          </div>
          <div className="text-center p-2 bg-emerald-50 rounded-lg">
            <div className="text-lg font-bold text-emerald-600">{student.attendance}%</div>
            <div className="text-xs text-gray-600">Présence</div>
          </div>
          <div className="text-center p-2 bg-purple-50 rounded-lg">
            <div className="text-lg font-bold text-purple-600">{student.courses}</div>
            <div className="text-xs text-gray-600">Cours</div>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => {
              setSelectedStudent(student);
              setShowDetailsModal(true);
            }}
            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Détails
          </button>
          <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
            <Edit className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Étudiants</h1>
        <p className="text-gray-600">Gérez et consultez tous les étudiants inscrits</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <StatsCard 
          icon={User} 
          title="Total Étudiants" 
          value="342" 
          change="+12%" 
          color="from-blue-500 to-blue-600" 
        />
        <StatsCard 
          icon={Award} 
          title="Taux de Réussite" 
          value="89%" 
          change="+5%" 
          color="from-emerald-500 to-emerald-600" 
        />
        <StatsCard 
          icon={Clock} 
          title="Présence Moyenne" 
          value="94%" 
          change="+8%" 
          color="from-purple-500 to-purple-600" 
        />
        <StatsCard 
          icon={Star} 
          title="Note Moyenne" 
          value="4.7/5" 
          change="+0.3%" 
          color="from-orange-500 to-orange-600" 
        />
      </div>

      <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Rechercher un étudiant..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
            />
          </div>
          <div className="flex gap-3">
            <select 
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
            >
              <option value="all">Tous les Domaines</option>
              <option value="Physique Mathématique">Physique Mathématique</option>
              <option value="Physique Expérimentale">Physique Expérimentale</option>
              <option value="Physique Théorique">Physique Théorique</option>
            </select>
            <select 
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
            >
              <option value="all">Tous les Niveaux</option>
              <option value="Master 1">Master 1</option>
              <option value="Master 2">Master 2</option>
              <option value="Doctorat">Doctorat</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exporter
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredStudents.map((student) => (
          <StudentCard key={student.id} student={student} />
        ))}
      </div>

      {showDetailsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Profil Étudiant</h2>
                <button 
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            {selectedStudent && (
              <div className="p-6">
                <div className="flex items-center gap-6 mb-6">
                  <div className={`w-20 h-20 bg-gradient-to-br ${getAvatarColor(selectedStudent.field)} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <span className="text-white font-bold text-2xl">{selectedStudent.avatar}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedStudent.firstName} {selectedStudent.lastName}
                    </h3>
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-lg text-sm font-medium ${fieldColors[selectedStudent.field]}`}>
                        {selectedStudent.field}
                      </span>
                      <span className={`px-3 py-1 rounded-lg text-sm font-medium ${statusColors[selectedStudent.status]}`}>
                        {selectedStudent.status}
                      </span>
                    </div>
                    <p className="text-gray-600">Inscrit le {new Date(selectedStudent.joinDate).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-bold text-gray-900 mb-3">Contact</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">{selectedStudent.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">{selectedStudent.phone}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-bold text-gray-900 mb-3">Académique</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <GraduationCap className="w-4 h-4" />
                        <span className="text-sm">{selectedStudent.level}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{selectedStudent.school}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4">Performance</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-1">{selectedStudent.score}%</div>
                      <div className="text-gray-600 text-sm">Note Moyenne</div>
                      <div className="w-full bg-blue-100 rounded-full h-2 mt-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${selectedStudent.score}%` }}></div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-emerald-600 mb-1">{selectedStudent.attendance}%</div>
                      <div className="text-gray-600 text-sm">Présence</div>
                      <div className="w-full bg-emerald-100 rounded-full h-2 mt-2">
                        <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${selectedStudent.attendance}%` }}></div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-1">{selectedStudent.courses}</div>
                      <div className="text-gray-600 text-sm">Cours</div>
                      <div className="w-full bg-purple-100 rounded-full h-2 mt-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${(selectedStudent.courses / 15) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsPage;