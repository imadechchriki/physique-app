import React from 'react';
import { Atom } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
              <Atom className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">PhysicsEval</span>
          </div>
          <p className="text-slate-400 max-w-md">
            La plateforme d'évaluation moderne pour l'enseignement de la physique. Inspirez la prochaine génération de scientifiques.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Plateforme</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-cyan-400">Fonctionnalités</a></li>
            <li><a href="#" className="hover:text-cyan-400">Tarifs</a></li>
            <li><a href="#" className="hover:text-cyan-400">Intégrations</a></li>
            <li><a href="#" className="hover:text-cyan-400">API</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Support</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-cyan-400">Documentation</a></li>
            <li><a href="#" className="hover:text-cyan-400">Tutoriels</a></li>
            <li><a href="#" className="hover:text-cyan-400">Contact</a></li>
            <li><a href="#" className="hover:text-cyan-400">FAQ</a></li>
          </ul>
        </div>
      </div>

      <div className="text-center border-t border-slate-700 mt-8 pt-4">
        &copy; 2024 PhysicsEval. Tous droits réservés.
      </div>
    </footer>
  );
};

export default Footer;
