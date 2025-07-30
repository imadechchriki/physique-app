import React, { useState, useEffect } from 'react';
import { Zap, ArrowRight, ChevronDown, Play } from 'lucide-react';

const HeroSection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ 
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-5 text-white text-6xl font-light pointer-events-none">
        <div className="absolute top-20 left-20">E = mc²</div>
        <div className="absolute top-40 right-20">F = ma</div>
        <div className="absolute bottom-40 left-40">v = λf</div>
        <div className="absolute bottom-20 right-40">P = IV</div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
          Évaluez l'avenir de la
          <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            physique moderne
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto">
          Plateforme d'évaluation interactive pour l'enseignement de la physique.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button onClick={() => window.location.href = '/login'} className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-3 hover:scale-105 transition-all">
            <Zap className="w-5 h-5" />
            Commencer l'évaluation
            <ArrowRight className="w-5 h-5" />
          </button>
          <button className="border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-900 px-8 py-4 rounded-xl font-semibold flex items-center gap-3">
            <Play className="w-5 h-5" />
            Voir la démo
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="bg-gradient-to-br from-cyan-400 to-blue-500 p-3 rounded-full shadow-lg">
          <ChevronDown className="w-6 h-6 text-white" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
