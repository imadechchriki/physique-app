import React from 'react';
import { BookOpen, Brain, BarChart3, Users, Beaker, Award, ArrowRight } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Gestion de cours",
      description: "Uploadez facilement vos supports de cours, PDFs, vidéos et ressources pédagogiques",
      color: "from-cyan-500 to-blue-500"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Quiz interactifs",
      description: "Créez des évaluations dynamiques avec des QCM, calculs et simulations",
      color: "from-blue-500 to-purple-500"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Analytics avancés",
      description: "Suivez les performances en temps réel avec des graphiques détaillés",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Collaboration",
      description: "Facilitez les échanges entre étudiants et enseignants avec des outils collaboratifs",
      color: "from-pink-500 to-red-500"
    },
    {
      icon: <Beaker className="w-8 h-8" />,
      title: "Simulations",
      description: "Intégrez des expériences virtuelles et des simulations physiques",
      color: "from-red-500 to-orange-500"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Certification",
      description: "Délivrez des certificats automatiques basés sur les résultats",
      color: "from-orange-500 to-yellow-500"
    }
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            Fonctionnalités <span className="text-cyan-600">avancées</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Des outils modernes conçus pour l'enseignement de la physique
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group bg-white rounded-2xl p-8 shadow-lg border hover:border-cyan-200 transition-all hover:-translate-y-2">
              <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-6`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">{feature.title}</h3>
              <p className="text-slate-600">{feature.description}</p>
              <div className="mt-6 text-cyan-600 font-medium flex items-center gap-2">
                En savoir plus <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
