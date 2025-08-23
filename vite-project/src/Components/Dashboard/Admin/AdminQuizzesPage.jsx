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
  Settings,
  CheckCircle,
  Circle,
  Clock,
  Users
} from "lucide-react";

const AdminQuizzes = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showQuizViewer, setShowQuizViewer] = useState(false);
  const [showQuestionEditor, setShowQuestionEditor] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  
  // État pour les données de quiz avec fonctionnalités d'administration
  const [quizzesData, setQuizzesData] = useState({
    introduction: {
      subtitle: "Quiz introductifs",
      title: "Quiz d'introduction",
      sections: [
        {
          id: 1,
          title: "QCM - Mesures et incertitudes",
          courseLabel: "QCM INTRODUCTIF",
          hasContent: true,
          pdfFile: null,
          duration: 15,
          maxScore: 10,
          questionsCount: 5,
          content: {
            breadcrumb: "Accueil > Administration > Quiz > QCM : Mesures et incertitudes",
            mainTitle: "QCM - Mesures et incertitudes",
            description: "Quiz rapide sur les mesures et incertitudes en physique-chimie",
            duration: "15 minutes",
            maxScore: "10 points",
            questions: [
              {
                id: 1,
                question: "Quelle est l'unité de base de la masse dans le système international ?",
                options: ["gramme (g)", "kilogramme (kg)", "tonne (t)", "milligramme (mg)"],
                correctAnswer: 1,
                explanation: "Le kilogramme (kg) est l'unité de base de la masse dans le système international (SI)."
              },
              {
                id: 2,
                question: "L'incertitude absolue d'une mesure exprime :",
                options: [
                  "La précision de l'instrument de mesure",
                  "L'erreur maximale possible sur la mesure",
                  "La valeur exacte de la grandeur mesurée",
                  "La différence entre deux mesures"
                ],
                correctAnswer: 1,
                explanation: "L'incertitude absolue exprime l'erreur maximale possible sur une mesure."
              }
            ]
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
          title: "QCM - Les mélanges",
          courseLabel: "QCM 1",
          hasContent: false,
          pdfFile: null,
          duration: 20,
          maxScore: 15,
          questionsCount: 10,
          content: null
        },
        {
          id: 3,
          title: "Quiz - Solutions aqueuses", 
          courseLabel: "QCM 2",
          hasContent: false,
          pdfFile: null,
          duration: 25,
          maxScore: 20,
          questionsCount: 15,
          content: null
        },
        {
          id: 4,
          title: "QCM - Constituants de la matière",
          courseLabel: "QCM 3",
          hasContent: false,
          pdfFile: null,
          duration: 15,
          maxScore: 10,
          questionsCount: 8,
          content: null
        },
        {
          id: 5,
          title: "Quiz - Stabilité chimique",
          courseLabel: "QCM 4",
          hasContent: false,
          pdfFile: null,
          duration: 30,
          maxScore: 25,
          questionsCount: 12,
          content: null
        },
        {
          id: 6,
          title: "QCM - Quantité de matière",
          courseLabel: "QCM 5",
          hasContent: false,
          pdfFile: null,
          duration: 20,
          maxScore: 15,
          questionsCount: 10,
          content: null
        },
        {
          id: 7,
          title: "Quiz - Transformations physiques",
          courseLabel: "QCM 6",
          hasContent: false,
          pdfFile: null,
          duration: 25,
          maxScore: 20,
          questionsCount: 12,
          content: null
        },
        {
          id: 8,
          title: "QCM - Transformations chimiques",
          courseLabel: "QCM 7",
          hasContent: false,
          pdfFile: null,
          duration: 35,
          maxScore: 30,
          questionsCount: 18,
          content: null
        },
        {
          id: 9,
          title: "Quiz - Transformations nucléaires",
          courseLabel: "QCM 8",
          hasContent: false,
          pdfFile: null,
          duration: 20,
          maxScore: 15,
          questionsCount: 10,
          content: null
        }
      ]
    }
  });

  const [newQuiz, setNewQuiz] = useState({
    title: "",
    courseLabel: "",
    theme: "introduction",
    duration: 15,
    maxScore: 10,
    questionsCount: 5
  });

  const [newQuestion, setNewQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    explanation: ""
  });

  const AdminQuizCard = ({ section, isIntro = false, themeKey, sectionIndex }) => (
    <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 group overflow-hidden min-h-[200px]">
      {/* Fond coloré en haut */}
      <div className="h-24 w-full bg-gradient-to-br from-green-100 to-green-200"></div>
      
      {/* Boutons d'administration overlay */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 space-x-1">
        <button
          onClick={() => handleViewQuiz(section)}
          className="p-1.5 bg-white/90 hover:bg-white text-gray-600 hover:text-blue-600 rounded-md shadow-sm transition-colors"
          title="Voir le quiz"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleEditQuiz(section, themeKey, sectionIndex)}
          className="p-1.5 bg-white/90 hover:bg-white text-gray-600 hover:text-green-600 rounded-md shadow-sm transition-colors"
          title="Modifier"
        >
          <Edit3 className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleDeleteQuiz(themeKey, sectionIndex)}
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
        
        {/* Informations sur le quiz */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{section.duration} min</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              <span>{section.questionsCount} Q</span>
            </div>
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

  const handleViewQuiz = (quiz) => {
    if (quiz.hasContent) {
      setSelectedQuiz(quiz);
      setShowQuizViewer(true);
    }
  };

  const handleEditQuiz = (quiz, themeKey, sectionIndex) => {
    setSelectedQuiz({ ...quiz, themeKey, sectionIndex });
    setShowEditModal(true);
  };

  const handleDeleteQuiz = (themeKey, sectionIndex) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce quiz ?')) {
      setQuizzesData(prev => ({
        ...prev,
        [themeKey]: {
          ...prev[themeKey],
          sections: prev[themeKey].sections.filter((_, index) => index !== sectionIndex)
        }
      }));
    }
  };

  const handleAddQuiz = () => {
    if (newQuiz.title.trim() && newQuiz.courseLabel.trim()) {
      const quiz = {
        id: Date.now(),
        title: newQuiz.title,
        courseLabel: newQuiz.courseLabel,
        hasContent: false,
        pdfFile: null,
        duration: parseInt(newQuiz.duration),
        maxScore: parseInt(newQuiz.maxScore),
        questionsCount: parseInt(newQuiz.questionsCount),
        content: null
      };

      setQuizzesData(prev => ({
        ...prev,
        [newQuiz.theme]: {
          ...prev[newQuiz.theme],
          sections: [...prev[newQuiz.theme].sections, quiz]
        }
      }));

      setNewQuiz({
        title: "",
        courseLabel: "",
        theme: "introduction",
        duration: 15,
        maxScore: 10,
        questionsCount: 5
      });
      setShowAddModal(false);
    }
  };

  const handleAddQuestion = () => {
    if (newQuestion.question.trim() && newQuestion.options.every(opt => opt.trim())) {
      // Logique pour ajouter la question au quiz sélectionné
      console.log("Nouvelle question:", newQuestion);
      setNewQuestion({
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        explanation: ""
      });
      setShowQuestionEditor(false);
    }
  };

  const QuestionEditor = () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Ajouter une Question</h3>
          <button
            onClick={() => setShowQuestionEditor(false)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Question *
            </label>
            <textarea
              value={newQuestion.question}
              onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 h-24 resize-none"
              placeholder="Saisissez votre question ici..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Options de réponse *
            </label>
            <div className="space-y-3">
              {newQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center gap-3">
                  <button
                    onClick={() => setNewQuestion({ ...newQuestion, correctAnswer: index })}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      newQuestion.correctAnswer === index
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    {newQuestion.correctAnswer === index && <CheckCircle className="w-4 h-4" />}
                  </button>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...newQuestion.options];
                        newOptions[index] = e.target.value;
                        setNewQuestion({ ...newQuestion, options: newOptions });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Cliquez sur le cercle pour sélectionner la bonne réponse
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Explication (optionnelle)
            </label>
            <textarea
              value={newQuestion.explanation}
              onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 h-20 resize-none"
              placeholder="Expliquez pourquoi cette réponse est correcte..."
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowQuestionEditor(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleAddQuestion}
              disabled={!newQuestion.question.trim() || !newQuestion.options.every(opt => opt.trim())}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Ajouter la Question
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const QuizViewer = ({ quiz }) => (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500 mb-2">
                {quiz.content?.breadcrumb}
              </div>
              <button
                onClick={() => setShowQuizViewer(false)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <X className="w-5 h-5" />
                Retour aux quiz
              </button>
            </div>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Télécharger en PDF
            </button>
          </div>
        </div>
      </div>

      {/* Contenu du quiz */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
              {/* Titre principal */}
              <div className="bg-green-600 text-white p-6 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-xl font-bold">
                    Q
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">
                      {quiz.content?.mainTitle}
                    </h1>
                    <p className="text-green-100 mt-1">
                      {quiz.content?.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Informations sur le quiz */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Questions</h2>
                  <button 
                    onClick={() => setShowQuestionEditor(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter une Question
                  </button>
                </div>
                
                {/* Liste des questions */}
                <div className="space-y-4">
                  {quiz.content?.questions?.map((q, index) => (
                    <div key={q.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">
                          Question {index + 1}: {q.question}
                        </h3>
                        <div className="flex gap-2">
                          <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {q.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`p-2 rounded border text-sm ${
                              optIndex === q.correctAnswer
                                ? 'bg-green-50 border-green-200 text-green-800'
                                : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <span className="font-medium">{String.fromCharCode(65 + optIndex)}.</span> {option}
                            {optIndex === q.correctAnswer && (
                              <CheckCircle className="w-4 h-4 text-green-600 inline ml-2" />
                            )}
                          </div>
                        ))}
                      </div>
                      {q.explanation && (
                        <div className="bg-blue-50 border border-blue-200 rounded p-3">
                          <p className="text-sm text-blue-800">
                            <strong>Explication:</strong> {q.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  )) || (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">Aucune question créée pour ce quiz</p>
                      <button 
                        onClick={() => setShowQuestionEditor(true)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Créer la première question
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Informations</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Durée</p>
                  <p className="font-semibold">{quiz.content?.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Note maximale</p>
                  <p className="font-semibold">{quiz.content?.maxScore}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Questions</p>
                  <p className="font-semibold">{quiz.content?.questions?.length || 0}</p>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <button className="w-full flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                  <Edit3 className="w-4 h-4" />
                  <span>Modifier le quiz</span>
                </button>
                <button 
                  onClick={() => setShowQuestionEditor(true)}
                  className="w-full flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter question</span>
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
      {/* Bouton d'action */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Ajouter un Quiz
        </button>
      </div>

      {/* Section Introduction */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              {quizzesData.introduction.subtitle}
            </p>
            <h2 className="text-xl font-bold text-gray-900">
              {quizzesData.introduction.title}
            </h2>
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {quizzesData.introduction.sections.map((section, index) => (
            <AdminQuizCard 
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
              {quizzesData.theme1.subtitle}
            </p>
            <h2 className="text-xl font-bold text-gray-900">
              {quizzesData.theme1.title}
            </h2>
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {quizzesData.theme1.sections.map((section, index) => (
            <AdminQuizCard 
              key={section.id} 
              section={section} 
              isIntro={false} 
              themeKey="theme1"
              sectionIndex={index}
            />
          ))}
        </div>
      </div>

      {/* Modal d'ajout de quiz */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Ajouter un Quiz</h3>
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
                  Titre du quiz *
                </label>
                <input
                  type="text"
                  value={newQuiz.title}
                  onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="ex: QCM - Les mélanges"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Label du quiz *
                </label>
                <input
                  type="text"
                  value={newQuiz.courseLabel}
                  onChange={(e) => setNewQuiz({ ...newQuiz, courseLabel: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="ex: QCM 1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thème
                </label>
                <select
                  value={newQuiz.theme}
                  onChange={(e) => setNewQuiz({ ...newQuiz, theme: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
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
                    value={newQuiz.duration}
                    onChange={(e) => setNewQuiz({ ...newQuiz, duration: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    min="5"
                    max="120"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Note max
                  </label>
                  <input
                    type="number"
                    value={newQuiz.maxScore}
                    onChange={(e) => setNewQuiz({ ...newQuiz, maxScore: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
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
                    value={newQuiz.questionsCount}
                    onChange={(e) => setNewQuiz({ ...newQuiz, questionsCount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    min="1"
                    max="50"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddQuiz}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Créer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Viewer de quiz */}
      {showQuizViewer && selectedQuiz && (
        <QuizViewer quiz={selectedQuiz} />
      )}

      {/* Éditeur de questions */}
      {showQuestionEditor && (
        <QuestionEditor />
      )}

      {/* Modal d'édition */}
      {showEditModal && selectedQuiz && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Modifier le Quiz</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre du quiz *
                </label>
                <input
                  type="text"
                  defaultValue={selectedQuiz.title}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Label du quiz *
                </label>
                <input
                  type="text"
                  defaultValue={selectedQuiz.courseLabel}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durée (min)
                  </label>
                  <input
                    type="number"
                    defaultValue={selectedQuiz.duration}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    min="5"
                    max="120"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Note max
                  </label>
                  <input
                    type="number"
                    defaultValue={selectedQuiz.maxScore}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
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
                    defaultValue={selectedQuiz.questionsCount}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    min="1"
                    max="50"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQuizzes;