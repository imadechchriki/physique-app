import React from "react";
import { Link } from 'react-router-dom';
import { Target, Mail, Phone, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';


function Footer() {
  return (
    <div className="bg-gray-900 text-white py-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-emerald-500 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2 animate-fade-in-up">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full p-2 shadow-lg animate-pulse">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                EvalIng
              </h3>
            </div>
            <p className="text-gray-400 leading-relaxed max-w-md">
              Plateforme d'évaluation moderne pour les futurs ingénieurs. 
              Simplifiez vos processus d'évaluation et améliorez l'expérience éducative.
            </p>
          </div>
          
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h4 className="text-lg font-semibold mb-4 text-emerald-400">Liens rapides</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">Accueil</a></li>
              <li><a href="#fonctionnalites" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">Fonctionnalités</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">À propos</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">Contact</a></li>
            </ul>
          </div>
          
          <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <h4 className="text-lg font-semibold mb-4 text-emerald-400">Contact</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                <a href="mailto:contact@evaling.com" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                  contact@evaling.com
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-400">+123 456 7890</span>
              </div>
            </div>
            
            <div className="flex space-x-4 mt-6">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, index) => (
                <a 
                  key={index}
                  href="#" 
                  className="text-gray-400 hover:text-emerald-400 transition-all duration-300 transform hover:scale-110"
                  style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <p className="text-gray-400">
            &copy; 2025 EvalIng. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
