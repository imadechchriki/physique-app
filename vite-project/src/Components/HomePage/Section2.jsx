import React from "react";

import { Award, Users, BarChart3 } from "lucide-react";

function Section2() {
  const steps = [
    {
      icon: <Award className="w-16 h-16 text-emerald-600" />,
      title: "Création de l'évaluation",
      description: "Les administrateurs définissent les critères d'évaluation avec des outils intuitifs",
      color: "from-emerald-500 to-cyan-500"
    },
    {
      icon: <Users className="w-16 h-16 text-purple-600" />,
      title: "Soumission des évaluations",
      description: "Les étudiants et enseignants soumettent leurs travaux facilement",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <BarChart3 className="w-16 h-16 text-blue-600" />,
      title: "Analyse des résultats",
      description: "Analyse détaillée et visualisation des performances en temps réel",
      color: "from-blue-500 to-indigo-500"
    }
  ];

  return (
    <div className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-20 left-10 w-40 h-40 bg-emerald-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Comment ça marche</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Un processus simple et efficace en trois étapes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="relative group animate-fade-in-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 group-hover:border-emerald-200">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`bg-gradient-to-br ${step.color} bg-opacity-10 p-6 rounded-full group-hover:scale-110 transition-all duration-300 animate-pulse`}>
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
                
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${step.color} rounded-t-2xl`}></div>
              </div>
              
              {/* Animated Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-emerald-300 to-purple-300 animate-pulse"></div>
                  <div className="absolute -right-1 -top-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Section2;