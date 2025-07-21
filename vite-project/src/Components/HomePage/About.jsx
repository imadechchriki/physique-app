import React from "react";
import { Link } from "react-router-dom";
import { Users, Target, Award } from "lucide-react";
import { useState, useEffect } from "react";

function About() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('about');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const stats = [
    { icon: Users, value: "3K+", label: "Étudiants", color: "emerald" },
    { icon: Target, value: "6", label: "Filières", color: "purple" },
    { icon: Award, value: "10K+", label: "Instructeurs", color: "blue" }
  ];

  return (
    <div id="about" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 w-32 h-32 bg-emerald-500 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-purple-500 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center animate-fade-in-up">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            À Propos de <span className="bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">Nous</span>
          </h2>
          <div className="bg-white rounded-3xl p-12 shadow-2xl border border-gray-100 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed max-w-4xl mx-auto">
              EvalIng est une plateforme innovante dédiée à l'évaluation continue des étudiants en ingénierie.
              Nous permettons aux enseignants et administrateurs de suivre efficacement les progrès des étudiants, 
              tout en fournissant un retour détaillé pour chaque évaluation. Notre mission est de rendre l'évaluation 
              plus accessible, transparente et précise pour tous les acteurs de l'éducation.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className={`text-center transform transition-all duration-500 animate-fade-in-up ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                  style={{ animationDelay: `${0.4 + index * 0.2}s` }}
                >
                  <div className={`bg-${stat.color}-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-gentle`}>
                    <stat.icon className={`w-8 h-8 text-${stat.color}-600`} />
                  </div>
                  <h3 className={`text-3xl font-bold text-${stat.color}-600 animate-count-up`}>{stat.value}</h3>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;