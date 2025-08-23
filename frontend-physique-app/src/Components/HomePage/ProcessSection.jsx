import React from 'react';
import { BookOpen, Brain, BarChart3, ArrowRight } from 'lucide-react';

const ProcessSection = () => {
  const steps = [
    {
      icon: <BookOpen className="w-12 h-12" />,
      title: "Créez vos cours",
      description: "Uploadez vos supports pédagogiques et organisez le contenu",
      color: "from-cyan-500 to-blue-500"
    },
    {
      icon: <Brain className="w-12 h-12" />,
      title: "Concevez des évaluations",
      description: "Créez des quiz interactifs et utilisez des modèles prêts",
      color: "from-blue-500 to-purple-500"
    },
    {
      icon: <BarChart3 className="w-12 h-12" />,
      title: "Analysez les résultats",
      description: "Suivez les progrès et ajustez l'apprentissage",
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Comment ça <span className="text-cyan-400">fonctionne</span>
          </h2>
          <p className="text-xl text-slate-300 mt-4">
            Un processus simple en trois étapes
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-slate-700/50 p-8 rounded-2xl text-center border border-slate-600 hover:border-cyan-500">
              <div className={`bg-gradient-to-br ${step.color} p-4 rounded-xl text-white inline-block mb-4`}>
                {step.icon}
              </div>
              <div className="text-2xl font-bold text-cyan-400 mb-2">{index + 1}</div>
              <h3 className="text-xl text-white font-semibold mb-2">{step.title}</h3>
              <p className="text-slate-300">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
