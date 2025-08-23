import React from "react";

const Quizzes = () => {
  // Données des quiz organisées par type comme les examens
  const quizData = {
    pratique: {
      subtitle: "Révisions rapides",
      title: "Quiz de Pratique",
      sections: [
        {
          title: "Quiz - Atomes et éléments",
          quizLabel: "QUIZ PRATIQUE 1"
        },
        {
          title: "Quiz - Liaisons chimiques",
          quizLabel: "QUIZ PRATIQUE 2"
        },
        {
          title: "Quiz - Réactions d'oxydo-réduction",
          quizLabel: "QUIZ PRATIQUE 3"
        },
        {
          title: "Quiz - Équilibres chimiques",
          quizLabel: "QUIZ PRATIQUE 4"
        },
        {
          title: "Quiz - Cinétique chimique",
          quizLabel: "QUIZ PRATIQUE 5"
        }
      ]
    },
    thematiques: {
      subtitle: "Approfondissement par chapitre",
      title: "Quiz Thématiques",
      sections: [
        {
          title: "Quiz - Thermodynamique",
          quizLabel: "QUIZ THÉMATIQUE 1"
        },
        {
          title: "Quiz - Électrochimie",
          quizLabel: "QUIZ THÉMATIQUE 2"
        },
        {
          title: "Quiz - Chimie organique",
          quizLabel: "QUIZ THÉMATIQUE 3"
        },
        {
          title: "Quiz - Analyse spectrale",
          quizLabel: "QUIZ THÉMATIQUE 4"
        }
      ]
    },
    challenges: {
      subtitle: "Tests avancés",
      title: "Quiz Défis",
      sections: [
        {
          title: "Défi - Synthèse complexe",
          quizLabel: "QUIZ DÉFI 1"
        },
        {
          title: "Défi - Mécanismes réactionnels",
          quizLabel: "QUIZ DÉFI 2"
        },
        {
          title: "Défi - Problèmes multi-étapes",
          quizLabel: "QUIZ DÉFI 3"
        }
      ]
    }
  };

  const QuizCard = ({ section, quizType = "pratique" }) => {
    // Couleurs différentes selon le type de quiz
    const getColorClass = () => {
      switch (quizType) {
        case "pratique":
          return "bg-gradient-to-br from-green-100 to-green-200";
        case "thematique":
          return "bg-gradient-to-br from-purple-100 to-purple-200";
        case "challenge":
          return "bg-gradient-to-br from-pink-100 to-pink-200";
        default:
          return "bg-gradient-to-br from-gray-100 to-gray-200";
      }
    };

    return (
      <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer group overflow-hidden min-h-[200px]">
        {/* Fond coloré en haut */}
        <div className={`h-24 w-full ${getColorClass()}`}></div>
        
        {/* Contenu principal */}
        <div className="p-4 -mt-4 relative bg-white">
          <h3 className="text-base font-semibold text-gray-900 mb-6 leading-tight min-h-[3rem]">
            {section.title}
          </h3>
          
          {/* Badge du quiz en bas */}
          <div className="absolute bottom-4 left-4">
            <span className="inline-block px-3 py-1 bg-gray-100 text-xs font-medium text-gray-600 rounded">
              {section.quizLabel}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-12">
      {/* Section Quiz de Pratique */}
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">
            {quizData.pratique.subtitle}
          </p>
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {quizData.pratique.title}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {quizData.pratique.sections.map((section, index) => (
            <QuizCard key={index} section={section} quizType="pratique" />
          ))}
        </div>
      </div>

      {/* Section Quiz Thématiques */}
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">
            {quizData.thematiques.subtitle}
          </p>
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {quizData.thematiques.title}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {quizData.thematiques.sections.map((section, index) => (
            <QuizCard key={index} section={section} quizType="thematique" />
          ))}
        </div>
      </div>

      {/* Section Quiz Défis */}
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">
            {quizData.challenges.subtitle}
          </p>
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {quizData.challenges.title}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {quizData.challenges.sections.map((section, index) => (
            <QuizCard key={index} section={section} quizType="challenge" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quizzes;