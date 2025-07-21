import React from "react";
import section1 from '../images/HomePage/section1.png';
import { Link } from 'react-router-dom'; 
import { Target, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';


function Section1() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br  from-blue-900 via-blue-700 to-blue-900">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        {/* Interactive Floating Elements */}
        <div 
          className="absolute w-20 h-20 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full opacity-20 animate-float"
          style={{
            top: '20%',
            left: '10%',
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        ></div>
        <div 
          className="absolute w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-20 animate-float-delayed"
          style={{
            top: '40%',
            right: '20%',
            transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * -0.015}px)`
          }}
        ></div>
        <div 
          className="absolute w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full opacity-20 animate-pulse"
          style={{
            bottom: '20%',
            left: '20%',
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`
          }}
        ></div>
        
        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-12 grid-rows-12 h-full w-full">
            {Array.from({ length: 144 }).map((_, i) => (
              <div 
                key={i} 
                className="border border-emerald-500/20 animate-pulse" 
                style={{ animationDelay: `${i * 0.01}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        <div className="space-y-8">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight animate-fade-in-up">
            Bienvenue sur la
            <span className="block bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-gradient-x">
              plateforme d'évaluation
            </span>
            <span className="text-4xl md:text-5xl text-gray-300 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              des futurs ingénieurs
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            Évaluation efficace et suivi des progrès des étudiants en ingénierie avec des outils modernes et intuitifs
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
            <Link to="/login" >
            <button className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-4 rounded-full hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-2xl font-bold text-lg flex items-center gap-2 animate-bounce-gentle">
              <Target className="w-5 h-5" />
              Commencer l'évaluation
            </button>
            </Link>
            <Link to="/login">
            <button className="bg-transparent border-2 border-emerald-400 text-emerald-400 px-8 py-4 rounded-full hover:bg-emerald-400 hover:text-white transition-all duration-300 transform hover:scale-105 font-bold text-lg">
              Se connecter
            </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="bg-gradient-to-br from-emerald-400 to-cyan-500 p-2 rounded-full">
          <ChevronDown className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}


export default Section1;