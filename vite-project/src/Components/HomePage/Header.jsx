import React from 'react';
import { Link } from 'react-router-dom';
import logo from "../images/HomePage/Eval.png";
import { Target } from 'lucide-react';
import { useState, useEffect } from 'react';


function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900 text-white sticky top-0 z-50 transition-all duration-500 ${isScrolled ? 'shadow-2xl backdrop-blur-md bg-opacity-90' : 'shadow-lg'}`}>
      <header className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4 animate-fade-in-left">
          <div className="bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full p-2 shadow-lg animate-pulse">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            EvalIng
          </h1>
        </div>
        
        <nav className="hidden md:flex animate-fade-in-down">
          <ul className="flex space-x-8">
            {['Home', 'Fonctionnalités', 'À propos', 'Contact'].map((item, index) => (
              <li key={item} style={{ animationDelay: `${index * 0.1}s` }} className="animate-fade-in-down">
                <a href={`#${item.toLowerCase().replace(' ', '').replace('à', 'a')}`} className="hover:text-emerald-400 transition-all duration-300 relative group font-medium">
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        
        <Link to="/login" >
        <button className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-2 rounded-full hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold animate-fade-in-right">
          Se connecter
        </button>
        </Link>
      </header>
    </div>
  );
}


export default Header;
