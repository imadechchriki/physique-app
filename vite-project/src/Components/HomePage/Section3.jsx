import React, { useState } from "react";
import img4 from '../images/HomePage/4.png';
import img5 from '../images/HomePage/5.png';
import img6 from '../images/HomePage/6.png';
import { TrendingUp, MessageSquare, BarChart3, ChevronDown, ChevronUp } from "lucide-react";


function Section3() {
  const [activeFeature, setActiveFeature] = useState(null);
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const features = [
    {
      icon: <TrendingUp className="w-12 h-12 text-emerald-600" />,
      title: "Suivi des Progrès",
      description: "Suivez facilement les progrès des étudiants à travers leurs évaluations avec des tableaux de bord interactifs.",
      details: "Visualisation en temps réel, graphiques de progression, alertes automatiques pour les performances exceptionnelles ou nécessitant une attention particulière.",
      color: "from-emerald-500 to-cyan-500",
      accent: "emerald"
    },
    {
      icon: <MessageSquare className="w-12 h-12  text-purple-600" />,
      title: "Feedback Détaillé",
      description: "Fournissez des retours constructifs et personnalisés pour chaque évaluation avec notre système de commentaires avancé.",
      details: "Commentaires vocaux, annotations visuelles, suggestions d'amélioration automatiques basées sur l'IA, historique des retours.",
      color: "from-purple-500 to-pink-500",
      accent: "purple"
    },
    {
      icon: <BarChart3 className="w-12 h-12 text-blue-600" />,
      title: "Rapports d'Évaluation",
      description: "Générez des rapports complets avec des analyses statistiques approfondies et des visualisations interactives.",
      details: "Exportation PDF/Excel, comparaisons temporelles, analyses prédictives, recommandations pédagogiques personnalisées.",
      color: "from-blue-500 to-indigo-500",
      accent: "blue"
    }
  ];

  const toggleFeature = (index) => {
    setActiveFeature(activeFeature === index ? null : index);
  };

  return (
    <div id="fonctionnalites" className="py-20 bg-gradient-to-br  from-blue-900 via-blue-700 to-blue-900 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-40 h-40 bg-emerald-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-purple-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl font-bold text-white mb-4">
            Nos <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Fonctionnalités</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Des outils puissants pour révolutionner l'évaluation éducative
          </p>
        </div>

        <div className="space-y-12">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 transition-all duration-500 animate-fade-in-up ${
                hoveredFeature === index ? 'bg-white/20 scale-105' : 'hover:bg-white/15'
              } ${activeFeature === index ? 'ring-2 ring-emerald-400' : ''}`}
              style={{ animationDelay: `${index * 0.2}s` }}
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="flex-1 text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                    <div className={`p-3 rounded-full bg-gradient-to-r ${feature.color} shadow-lg animate-pulse`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
                  </div>
                  <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  <button
                    onClick={() => toggleFeature(index)}
                    className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-3 rounded-full hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 font-semibold flex items-center gap-2 mx-auto lg:mx-0 shadow-lg"
                  >
                    {activeFeature === index ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Moins de détails
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        Plus de détails
                      </>
                    )}
                  </button>
                </div>
                
                <div className="flex-1 flex justify-center">
                  <div className={`w-64 h-64 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center transform transition-all duration-500 ${
                    hoveredFeature === index ? 'scale-110 rotate-3' : 'hover:scale-105'
                  } shadow-2xl`}>
                    <div className="text-white text-8xl opacity-30 animate-pulse">
                      {feature.icon}
                    </div>
                  </div>
                </div>
              </div>
              
              {activeFeature === index && (
                <div className="mt-8 bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30 animate-slide-down">
                  <p className="text-gray-200 leading-relaxed">
                    {feature.details}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default Section3;
