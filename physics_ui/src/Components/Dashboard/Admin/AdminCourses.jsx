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

const AdminCourses = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCourseViewer, setShowCourseViewer] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // State for curriculum data with admin features
  const [curriculumData, setCurriculumData] = useState({
    introduction: {
      subtitle: "Thème introductif",
      title: "Introduction",
      sections: [
        {
          id: 1,
          title: "Mesures et incertitudes",
          courseLabel: "COURS INTRODUCTIF",
          hasContent: true,
          pdfFile: null,
          content: {
            breadcrumb: "Accueil > Seconde > Physique-Chimie > Cours : Les mélanges",
            mainTitle: "Les espèces chimiques, les corps purs et les mélanges",
            sections: [
              {
                id: "I",
                title: "Les espèces chimiques, les corps purs et les mélanges",
                subsections: [
                  { id: "A", title: "Les espèces chimiques" },
                  { id: "B", title: "Les corps purs et les mélanges" },
                  { id: "C", title: "Les mélanges homogènes et hétérogènes" }
                ]
              },
              {
                id: "II", 
                title: "La masse et le volume pour décrire la composition d'un mélange",
                subsections: [
                  { id: "A", title: "Les mesures de masse et de volume" },
                  { id: "B", title: "La masse volumique" },
                  { id: "C", title: "La composition d'un mélange" }
                ]
              },
              {
                id: "III",
                title: "L'identification d'une espèce chimique", 
                subsections: [
                  { id: "A", title: "L'identification d'une espèce chimique grâce à ses caractéristiques physiques" }
                ]
              }
            ]
          }
        }
      ]
    },
    theme1: {
      subtitle: "Thème 1", 
      title: "Constitutions et transformation de la matière",
      sections: [
        {
          id: 2,
          title: "Les mélanges",
          courseLabel: "COURS 1",
          hasContent: false,
          pdfFile: null,
          content: null
        },
        {
          id: 3,
          title: "Les solutions aqueuses", 
          courseLabel: "COURS 2",
          hasContent: false,
          pdfFile: null,
          content: null
        },
        {
          id: 4,
          title: "Les constituants de la matière",
          courseLabel: "COURS 3", 
          hasContent: false,
          pdfFile: null,
          content: null
        },
        {
          id: 5,
          title: "La stabilité chimique",
          courseLabel: "COURS 4",
          hasContent: false,
          pdfFile: null,
          content: null
        },
        {
          id: 6,
          title: "La quantité de matière",
          courseLabel: "COURS 5",
          hasContent: false,
          pdfFile: null,
          content: null
        },
        {
          id: 7,
          title: "Les transformations physiques",
          courseLabel: "COURS 6",
          hasContent: false,
          pdfFile: null,
          content: null
        },
        {
          id: 8,
          title: "Les transformations chimiques",
          courseLabel: "COURS 7",
          hasContent: false,
          pdfFile: null,
          content: null
        },
        {
          id: 9,
          title: "Les transformations nucléaires",
          courseLabel: "COURS 8",
          hasContent: false,
          pdfFile: null,
          content: null
        }
      ]
    }
  });

  const [newCourse, setNewCourse] = useState({
    title: "",
    courseLabel: "",
    theme: "introduction",
    pdfFile: null
  });

  const [newTheme, setNewTheme] = useState({
    subtitle: "",
    title: ""
  });

  const AdminCourseCard = ({ section, isIntro = false, themeKey, sectionIndex }) => (
    <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 group overflow-hidden min-h-[200px]">
      {/* Fond coloré en haut */}
      <div className="h-24 w-full bg-gradient-to-br from-green-100 to-green-200"></div>
      
      {/* Boutons d'administration overlay */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 space-x-1">
        <button
          onClick={() => handleViewCourse(section)}
          className="p-1.5 bg-white/90 hover:bg-white text-gray-600 hover:text-blue-600 rounded-md shadow-sm transition-colors"
          title="Voir le cours"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleEditCourse(section, themeKey, sectionIndex)}
          className="p-1.5 bg-white/90 hover:bg-white text-gray-600 hover:text-green-600 rounded-md shadow-sm transition-colors"
          title="Modifier"
        >
          <Edit3 className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleDeleteCourse(themeKey, sectionIndex)}
          className="p-1.5 bg-white/90 hover:bg-white text-gray-600 hover:text-red-600 rounded-md shadow-sm transition-colors"
          title="Supprimer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Indicateur de contenu */}
      <div className="absolute top-2 left-2">
        {section.hasContent ? (
          <div className="w-3 h-3 bg-green-500 rounded-full" title="Contenu disponible"></div>
        ) : (
          <div className="w-3 h-3 bg-gray-300 rounded-full" title="Pas de contenu"></div>
        )}
      </div>
      
      {/* Contenu principal */}
      <div className="p-4 -mt-4 relative bg-white">
        <h3 className="text-base font-semibold text-gray-900 mb-6 leading-tight min-h-[3rem]">
          {section.title}
        </h3>
        
        {/* Badge du cours en bas */}
        <div className="absolute bottom-4 left-4">
          <span className="inline-block px-3 py-1 bg-gray-100 text-xs font-medium text-gray-600 rounded">
            {section.courseLabel}
          </span>
        </div>
      </div>
    </div>
  );

  const handleViewCourse = (course) => {
    if (course.hasContent) {
      setSelectedCourse(course);
      setShowCourseViewer(true);
    }
  };

  const handleEditCourse = (course, themeKey, sectionIndex) => {
    setSelectedCourse({ ...course, themeKey, sectionIndex });
    setShowEditModal(true);
  };

  const handleDeleteCourse = (themeKey, sectionIndex) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      setCurriculumData(prev => ({
        ...prev,
        [themeKey]: {
          ...prev[themeKey],
          sections: prev[themeKey].sections.filter((_, index) => index !== sectionIndex)
        }
      }));
    }
  };

  const handleAddCourse = () => {
    if (newCourse.title.trim() && newCourse.courseLabel.trim()) {
      const course = {
        id: Date.now(),
        title: newCourse.title,
        courseLabel: newCourse.courseLabel,
        hasContent: !!newCourse.pdfFile,
        pdfFile: newCourse.pdfFile,
        content: null
      };

      setCurriculumData(prev => ({
        ...prev,
        [newCourse.theme]: {
          ...prev[newCourse.theme],
          sections: [...prev[newCourse.theme].sections, course]
        }
      }));

      setNewCourse({
        title: "",
        courseLabel: "",
        theme: "introduction",
        pdfFile: null
      });
      setShowAddModal(false);
    }
  };

  const CourseViewer = ({ course }) => (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header similaire à Kartable */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500 mb-2">
                {course.content?.breadcrumb}
              </div>
              <button
                onClick={() => setShowCourseViewer(false)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <X className="w-5 h-5" />
                Retour aux cours
              </button>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Télécharger en PDF
            </button>
          </div>
        </div>
      </div>

      {/* Contenu du cours */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
              {/* Titre principal avec style Kartable */}
              <div className="bg-blue-600 text-white p-6 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-xl font-bold">
                    I
                  </div>
                  <h1 className="text-2xl font-bold">
                    {course.content?.mainTitle}
                  </h1>
                </div>
              </div>

              {/* Section A avec style Kartable */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold">
                    A
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Les espèces chimiques</h2>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    Une espèce chimique est représentée par une unique formule chimique et correspond à un ensemble d'entités chimiques identiques entre elles.
                  </p>

                  {/* Définition avec style Kartable */}
                  <div className="bg-cyan-50 border-l-4 border-cyan-400 p-4 rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-cyan-400 text-white px-2 py-1 rounded text-xs font-medium">
                        DÉFINITION
                      </span>
                      <span className="font-semibold">Espèce chimique</span>
                    </div>
                    <p className="text-gray-700">
                      Une espèce chimique correspond à un ensemble d'entités chimiques identiques entre elles et représentées par la même formule. Il peut s'agir d'un atome, d'une molécule, d'un ion, etc.
                    </p>
                  </div>

                  {/* Exemple avec style Kartable */}
                  <div className="bg-gray-50 p-4 rounded">
                    <div className="mb-2">
                      <span className="text-gray-500 text-sm font-medium">EXEMPLE</span>
                    </div>
                    <p className="text-gray-700">
                      Les espèces chimiques qui composent le sel de cuisine sont les ions sodium{' '}
                      <span className="font-mono bg-gray-200 px-1 rounded">Na⁺</span> et chlorure{' '}
                      <span className="font-mono bg-gray-200 px-1 rounded">Cl⁻</span>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sommaire à droite */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Sommaire</h3>
              <div className="space-y-3">
                {course.content?.sections.map((section) => (
                  <div key={section.id}>
                    <div className="flex items-center gap-2 font-semibold text-gray-900 mb-2">
                      <span className="w-6 h-6 bg-gray-900 text-white rounded flex items-center justify-center text-sm">
                        {section.id}
                      </span>
                      <span className="text-sm">{section.title}</span>
                    </div>
                    <div className="ml-8 space-y-1">
                      {section.subsections?.map((subsection) => (
                        <div key={subsection.id} className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center text-xs">
                            {subsection.id}
                          </span>
                          <span>{subsection.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Action button moved to top right */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Ajouter un Cours
        </button>
      </div>

      {/* Section Introduction */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              {curriculumData.introduction.subtitle}
            </p>
            <h2 className="text-xl font-bold text-gray-900">
              {curriculumData.introduction.title}
            </h2>
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {curriculumData.introduction.sections.map((section, index) => (
            <AdminCourseCard 
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
              {curriculumData.theme1.subtitle}
            </p>
            <h2 className="text-xl font-bold text-gray-900">
              {curriculumData.theme1.title}
            </h2>
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {curriculumData.theme1.sections.map((section, index) => (
            <AdminCourseCard 
              key={section.id} 
              section={section} 
              isIntro={false} 
              themeKey="theme1"
              sectionIndex={index}
            />
          ))}
        </div>
      </div>

      {/* Modal d'ajout de cours */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Ajouter un Cours</h3>
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
                  Titre du cours *
                </label>
                <input
                  type="text"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="ex: Les mélanges"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Label du cours *
                </label>
                <input
                  type="text"
                  value={newCourse.courseLabel}
                  onChange={(e) => setNewCourse({ ...newCourse, courseLabel: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="ex: COURS 1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thème
                </label>
                <select
                  value={newCourse.theme}
                  onChange={(e) => setNewCourse({ ...newCourse, theme: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="introduction">Introduction</option>
                  <option value="theme1">Thème 1</option>
                </select>
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
                    onChange={(e) => setNewCourse({ ...newCourse, pdfFile: e.target.files[0] })}
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
                  onClick={handleAddCourse}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Créer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Course Viewer */}
      {showCourseViewer && selectedCourse && (
        <CourseViewer course={selectedCourse} />
      )}
    </div>
  );
};

export default AdminCourses;