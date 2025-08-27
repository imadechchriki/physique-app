import React, { useState, useEffect } from 'react';
import { Atom, Menu, X } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Accueil', href: '#home' },
    { name: 'Fonctionnalités', href: '#features' },
    { name: 'Cours', href: '#courses' },
    { name: 'À propos', href: '#about' }
  ];

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                <Atom className="w-6 h-6 text-white animate-spin-slow" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
            <span className="text-xl font-bold text-white">PhysicsEval</span>
          </div>

          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="text-slate-300 hover:text-cyan-400 transition-colors relative group">
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          <button onClick={() => window.location.href = '/login'} className="hidden md:block bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:scale-105 font-medium transition-all">
            Se connecter
          </button>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-white p-2">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-700">
            <div className="px-4 py-4 space-y-4">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} className="block text-slate-300 hover:text-cyan-400" onClick={() => setIsMobileMenuOpen(false)}>
                  {link.name}
                </a>
              ))}
              <button onClick={() => window.location.href = '/login'} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg font-medium">
                Se connecter
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
