import React, { useState } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Upload,
  FileText,
  Eye,
  X,
  Save,
  Download,
  Settings
} from "lucide-react";

const AdminExams = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showExamViewer, setShowExamViewer] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // État pour les données d'examens avec fonctionnalités d'administration
  const [examsData, setExamsData] = useState({
    introduction: {
      subtitle: "Évaluations introductives",
      title: "Tests d'introduction",
      sections: [
        {
          id: 1,
          title: "Test - Mesures et incertitudes",
          courseLabel: "TEST INTRODUCTIF",
          hasContent: true,
          pdfFile: null,
          duration: 30,
          maxScore: 20,
          questions: 10,
          content: {
            breadcrumb: "Accueil > Administration > Examens > Test : Mesures et incertitudes",
            mainTitle: "Test - Mesures et incertitudes",
            description: "Évaluation des connaissances sur les mesures et incertitudes en physique-chimie",
            duration: "30 minutes",
            maxScore: "20 points",
            questions: 10
          }
        }
      ]
    },
    theme1: {
      subtitle: "Thème 1", 
      title: "Constitution et transformation de la matière",
      sections: [
        {
          id: 2,
          title: "Contrôle - Les mélanges",
          courseLabel: "CONTRÔLE 1",
          hasContent: false,
          pdfFile: null,
          duration: 60,
          maxScore: 20,
          questions: 15,
          content: null
        },
        {
          id: 3,
          title: "Évaluation - Solutions aqueuses", 
          courseLabel: "CONTRÔLE 2",
          hasContent: false,
          pdfFile: null,
          duration: 90,
          maxScore: 20,
          questions: 20,
          content: null
        },
        {
          id: 4,
          title: "Test - Constituants de la matière",
          courseLabel: "TEST 1",
          hasContent: false,
          pdfFile: null,
          duration: 45,
          maxScore: 15,
          questions: 12,
          content: null
        },
        {
          id: 5,
          title: "Devoir Surveillé - Stabilité chimique",
          courseLabel: "DS 1",
          hasContent: false,
          pdfFile: null,
          duration: 120,
          maxScore: 20,
          questions: 8,
          content: null
        },
        {
          id: 6,
          title: "QCM - Quantité de matière",
          courseLabel: "QCM 1",
          hasContent: false,
          pdfFile: null,
          duration: 30,
          maxScore: 10,
          questions: 25,
          content: null
        },
        {
          id: 7,
          title: "Contrôle - Transformations physiques",
          courseLabel: "CONTRÔLE 3",
          hasContent: false,
          pdfFile: null,
          duration: 75,
          maxScore: 20,
          questions: 18,
          content: null
        },
        {
          id: 8,
          title: "Évaluation - Transformations chimiques",
          courseLabel: "CONTRÔLE 4",
          hasContent: false,
          pdfFile: null,
          duration: 90,
          maxScore: 20,
          questions: 16,
          content: null
        },
        {
          id: 9,
          title: "Test - Transformations nucléaires",
          courseLabel: "TEST 2",
          hasContent: false,
          pdfFile: null,
          duration: 60,
          maxScore: 15,
          questions: 14,
          content: null
        }
      ]
    }
  });

  const [newExam, setNewExam] = useState({
    title: "",
    courseLabel: "",
    theme: "introduction",
    pdfFile: null,
    duration: 60,
    maxScore: 20,
    questions: 10
  });

  const [newTheme, setNewTheme] = useState({
    subtitle: "",
    title: ""
  });

  const AdminExamCard = ({ section, isIntro = false, themeKey, sectionIndex }) => (
    <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 group overflow-hidden min-h-[200px]">
      {/* Fond coloré en haut */}
      <div className="h-24 w-full bg-gradient-to-br from-purple-100 to-purple-200"></div>
      
      {/* Boutons d'administration overlay */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 space-x-1">
        <button
          onClick={() => handleViewExam(section)}
          className="p-1.5 bg-white/90 hover:bg-white text-gray-600 hover:text-blue-600 rounded-md shadow-sm transition-colors"
          title="Voir l'examen"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleEditExam(section, themeKey, sectionIndex)}
          className="p-1.5 bg-white/90 hover:bg-white text-gray-600 hover:text-green-600 rounded-md shadow-sm transition-colors"
          title="Modifier"
        >
          <Edit3 className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleDeleteExam(themeKey, sectionIndex)}
          className="p-1.5 bg-white/90 hover:bg-white text-gray-600 hover:text-red-600 rounded-md shadow-sm transition-colors"
          title="Supprimer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Indicateur de contenu */}
      <div className="absolute top-2 left-2">
        {section.hasContent ? (
          <div className="w-3 h-3 bg-green-500 rounded-full" title="Questions créées"></div>
        ) : (
          <div className="w-3 h-3 bg-gray-300 rounded-full" title="Pas de questions"></div>
        )}
      </div>
      
      {/* Contenu principal */}
      <div className="p-4 -mt-4 relative bg-white">
        <h3 className="text-base font-semibold text-gray-900 mb-3 leading-tight min-h-[3rem]">
          {section.title}
        </h3>
        
        {/* Informations sur l'examen */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>{section.duration} min</span>
            <span>{section.questions} questions</span>
          </div>
          <div className="text-xs text-gray-600">
            Note max: {section.maxScore} pts
          </div>
        </div>
        
        {/* Badge du cours en bas */}
        <div className="absolute bottom-4 left-4">
          <span className="inline-block px-3 py-1 bg-gray-100 text-xs font-medium text-gray-600 rounded">
            {section.courseLabel}
          </span>
        </div>
      </div>
    </div>
  );

  const handleViewExam = (exam) => {
    if (exam.hasContent) {
      setSelectedExam(exam);
      setShowExamViewer(true);
    }
  };

  const handleEditExam = (exam, themeKey, sectionIndex) => {
    setSelectedExam({ ...exam, themeKey, sectionIndex });
    setShowEditModal(true);
  };

  const handleDeleteExam = (themeKey, sectionIndex) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet examen ?')) {
      setExamsData(prev => ({
        ...prev,
        [themeKey]: {
          ...prev[themeKey],
          sections: prev[themeKey].sections.filter((_, index) => index !== sectionIndex)
        }
      }));
    }
  };

  const handleAddExam = () => {
    if (newExam.title.trim() && newExam.courseLabel.trim()) {
      const exam = {
        id: Date.now(),
        title: newExam.title,
        courseLabel: newExam.courseLabel,
        hasContent: !!newExam.pdfFile,
        pdfFile: newExam.pdfFile,
        duration: parseInt(newExam.duration),
        maxScore: parseInt(newExam.maxScore),
        questions: parseInt(newExam.questions),
        content: null
      };

      setExamsData(prev => ({
        ...prev,
        [newExam.theme]: {
          ...prev[newExam.theme],
          sections: [...prev[newExam.theme].sections, exam]
        }
      }));

      setNewExam({
        title: "",
        courseLabel: "",
        theme: "introduction",
        pdfFile: null,
        duration: 60,
        maxScore: 20,
        questions: 10
      });
      setShowAddModal(false);
    }
  };

  const ExamViewer = ({ exam }) => (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header similaire à Kartable */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500 mb-2">
                {exam.content?.breadcrumb}
              </div>
              <button
                onClick={() => setShowExamViewer(false)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <X className="w-5 h-5" />
                Retour aux examens
              </button>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Télécharger en PDF
            </button>
          </div>
        </div>
      </div>

      {/* Contenu de l'examen */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
              {/* Titre principal avec style Kartable */}
              <div className="bg-purple-600 text-white p-6 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-xl font-bold">
                    E
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">
                      {exam.content?.mainTitle}
                    </h1>
                    <p className="text-purple-100 mt-1">
                      {exam.content?.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Informations sur l'examen */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Informations</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Durée</div>
                    <div className="font-semibold text-gray-900">{exam.content?.duration}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Note maximale</div>
                    <div className="font-semibold text-gray-900">{exam.content?.maxScore}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Questions</div>
                    <div className="font-semibold text-gray-900">{exam.content?.questions}</div>
                  </div>
                </div>
              </div>

              {/* Interface de gestion des questions */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Questions</h2>
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Interface de gestion des questions à développer</p>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    Gérer les questions
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sommaire à droite */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                  <Edit3 className="w-4 h-4" />
                  <span>Modifier l'examen</span>
                </button>
                <button className="w-full flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors">
                  <FileText className="w-4 h-4" />
                  <span>Gérer questions</span>
                </button>
                <button className="w-full flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Exporter PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Bouton d'action déplacé en haut à droite */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Ajouter un Examen
        </button>
      </div>

      {/* Section Introduction */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              {examsData.introduction.subtitle}
            </p>
            <h2 className="text-xl font-bold text-gray-900">
              {examsData.introduction.title}
            </h2>
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {examsData.introduction.sections.map((section, index) => (
            <AdminExamCard 
              key={section.id} 
              section={section} 
              isIntro={true} 
              themeKey="introduction"
              sectionIndex={index}
            />
          ))}
        </div>
      </div>

      {/* Section Thème 1 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              {examsData.theme1.subtitle}
            </p>
            <h2 className="text-xl font-bold text-gray-900">
              {examsData.theme1.title}
            </h2>
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {examsData.theme1.sections.map((section, index) => (
            <AdminExamCard 
              key={section.id} 
              section={section} 
              isIntro={false} 
              themeKey="theme1"
              sectionIndex={index}
            />
          ))}
        </div>
      </div>

      {/* Modal d'ajout d'examen */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Ajouter un Examen</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre de l'examen *
                </label>
                <input
                  type="text"
                  value={newExam.title}
                  onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="ex: Contrôle - Les mélanges"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Label de l'examen *
                </label>
                <input
                  type="text"
                  value={newExam.courseLabel}
                  onChange={(e) => setNewExam({ ...newExam, courseLabel: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="ex: CONTRÔLE 1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thème
                </label>
                <select
                  value={newExam.theme}
                  onChange={(e) => setNewExam({ ...newExam, theme: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="introduction">Introduction</option>
                  <option value="theme1">Thème 1</option>
                </select>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durée (min)
                  </label>
                  <input
                    type="number"
                    value={newExam.duration}
                    onChange={(e) => setNewExam({ ...newExam, duration: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="15"
                    max="300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Note max
                  </label>
                  <input
                    type="number"
                    value={newExam.maxScore}
                    onChange={(e) => setNewExam({ ...newExam, maxScore: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="5"
                    max="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Questions
                  </label>
                  <input
                    type="number"
                    value={newExam.questions}
                    onChange={(e) => setNewExam({ ...newExam, questions: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="1"
                    max="100"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fichier PDF (optionnel)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Glissez un fichier PDF ou cliquez pour sélectionner</p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setNewExam({ ...newExam, pdfFile: e.target.files[0] })}
                    className="hidden"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddExam}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Créer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Viewer d'examen */}
      {showExamViewer && selectedExam && (
        <ExamViewer exam={selectedExam} />
      )}
    </div>
  );
};

export default AdminExams;