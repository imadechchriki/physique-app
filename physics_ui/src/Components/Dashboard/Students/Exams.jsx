import React from "react";

const Exams = () => {
  // Données des examens organisées par type comme les cours
  const examData = {
    controles: {
      subtitle: "Évaluations continues",
      title: "Contrôles",
      sections: [
        {
          title: "Contrôle - Mesures et incertitudes",
          examLabel: "CONTRÔLE 1"
        },
        {
          title: "Contrôle - Les mélanges",
          examLabel: "CONTRÔLE 2"
        },
        {
          title: "Contrôle - Solutions aqueuses",
          examLabel: "CONTRÔLE 3"
        }
      ]
    },
    devoirs: {
      subtitle: "Évaluations approfondies",
      title: "Devoirs Surveillés",
      sections: [
        {
          title: "DS - Constitution de la matière",
          examLabel: "DEVOIR SURVEILLÉ 1"
        },
        {
          title: "DS - Transformations chimiques",
          examLabel: "DEVOIR SURVEILLÉ 2"
        },
        {
          title: "DS - Transformations physiques",
          examLabel: "DEVOIR SURVEILLÉ 3"
        },
        {
          title: "DS - Transformations nucléaires",
          examLabel: "DEVOIR SURVEILLÉ 4"
        }
      ]
    },
    examens: {
      subtitle: "Évaluations finales",
      title: "Examens Blancs",
      sections: [
        {
          title: "Examen Blanc - Semestre 1",
          examLabel: "EXAMEN BLANC 1"
        },
        {
          title: "Examen Blanc - Semestre 2",
          examLabel: "EXAMEN BLANC 2"
        }
      ]
    }
  };

  const ExamCard = ({ section, examType = "controle" }) => {
    // Couleurs différentes selon le type d'examen
    const getColorClass = () => {
      switch (examType) {
        case "controle":
          return "bg-gradient-to-br from-blue-100 to-blue-200";
        case "devoir":
          return "bg-gradient-to-br from-orange-100 to-orange-200";
        case "examen":
          return "bg-gradient-to-br from-red-100 to-red-200";
        default:
          return "bg-gradient-to-br from-green-100 to-green-200";
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
          
          {/* Badge de l'examen en bas */}
          <div className="absolute bottom-4 left-4">
            <span className="inline-block px-3 py-1 bg-gray-100 text-xs font-medium text-gray-600 rounded">
              {section.examLabel}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-12">
      {/* Section Contrôles */}
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">
            {examData.controles.subtitle}
          </p>
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {examData.controles.title}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {examData.controles.sections.map((section, index) => (
            <ExamCard key={index} section={section} examType="controle" />
          ))}
        </div>
      </div>

      {/* Section Devoirs Surveillés */}
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">
            {examData.devoirs.subtitle}
          </p>
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {examData.devoirs.title}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {examData.devoirs.sections.map((section, index) => (
            <ExamCard key={index} section={section} examType="devoir" />
          ))}
        </div>
      </div>

      {/* Section Examens Blancs */}
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">
            {examData.examens.subtitle}
          </p>
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {examData.examens.title}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {examData.examens.sections.map((section, index) => (
            <ExamCard key={index} section={section} examType="examen" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Exams;