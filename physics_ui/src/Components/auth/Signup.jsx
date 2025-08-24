import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Mail, Lock, Eye, EyeOff, Atom, ArrowRight, User, GraduationCap, BookOpen, FlaskConical, Zap, Brain, Microscope, Sparkles, Star, MapPin, School } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    highSchoolName: '',
    city: '',
    niveau: '1ère BAC',
    filiere: 'SM',
    termsAccepted: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [focusedField, setFocusedField] = useState(null);

  // Reduced particles for compact view
  const particles = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      speed: Math.random() * 0.3 + 0.1,
      opacity: Math.random() * 0.4 + 0.1,
      color: ['purple', 'blue', 'cyan'][Math.floor(Math.random() * 3)],
      delay: Math.random() * 2
    }));
  }, []);

  const filiereData = useMemo(() => [
    { code: 'SM', name: 'Sciences Mathématiques', desc: 'Maths & Physique', icon: Brain },
    { code: 'PC', name: 'Physique-Chimie', desc: 'Sciences Expérimentales', icon: FlaskConical },
    { code: 'SVT', name: 'Sciences de la Vie', desc: 'Biologie & Géologie', icon: Microscope }
  ], []);

  const handleMouseMove = useCallback((e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    setMousePosition({ x, y });
  }, []);

  useEffect(() => {
    let timeoutId;
    const throttledHandler = (e) => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => {
        handleMouseMove(e);
        timeoutId = null;
      }, 32);
    };

    window.addEventListener('mousemove', throttledHandler, { passive: true });
    return () => {
      window.removeEventListener('mousemove', throttledHandler);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [handleMouseMove]);

  const backgroundStyle = useMemo(() => ({
    background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
      rgba(168, 85, 247, 0.25) 0%, 
      rgba(59, 130, 246, 0.15) 30%, 
      transparent 60%)`
  }), [mousePosition.x, mousePosition.y]);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.firstName.trim() || formData.firstName.trim().length < 2) {
      newErrors.firstName = 'Prénom requis (min. 2 caractères)';
    }
    if (!formData.lastName.trim() || formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Nom requis (min. 2 caractères)';
    }
    if (!formData.highSchoolName.trim() || formData.highSchoolName.trim().length < 2) {
      newErrors.highSchoolName = 'Nom du lycée requis';
    }
    if (!formData.city.trim() || formData.city.trim().length < 2) {
      newErrors.city = 'Ville requise';
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email valide requis';
    }
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'Mot de passe min. 8 caractères';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mots de passe différents';
    }
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'Accepter les conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  // Handle niveau change to reset filiere when Tronc Commun is selected
  const handleNiveauChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset filiere if Tronc Commun is selected
      filiere: value === 'Tronc Commun' ? '' : prev.filiere
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Compte créé avec succès!');
    } catch (error) {
      setErrors({ general: 'Erreur lors de la création.' });
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateForm]);

  const getFiliereColors = useCallback((filiere) => {
    const colorMap = {
      'SM': { bg: 'from-emerald-500/20 to-green-500/20', border: 'border-emerald-400', text: 'text-emerald-300' },
      'PC': { bg: 'from-purple-500/20 to-violet-500/20', border: 'border-purple-400', text: 'text-purple-300' },
      'SVT': { bg: 'from-green-500/20 to-lime-500/20', border: 'border-green-400', text: 'text-green-300' }
    };
    return colorMap[filiere] || colorMap['PC'];
  }, []);

  // Check if Tronc Commun is selected to hide filiere selection
  const isTroncCommunSelected = formData.niveau === 'Tronc Commun';

  return (
    <div className="h-screen w-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Compact animated background */}
      <div className="absolute inset-0">
        {particles.map(particle => (
          <div
            key={particle.id}
            className={`absolute w-1 h-1 bg-${particle.color}-400 rounded-full opacity-20`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animation: `floatParticle ${8 + particle.speed * 10}s ${particle.delay}s infinite linear`
            }}
          />
        ))}
        
        <div 
          className="absolute inset-0 opacity-20 transition-all duration-1000"
          style={backgroundStyle}
        />
        
        {/* Simple atom decoration */}
        <div className="absolute top-8 right-8 w-16 h-16 opacity-10">
          <div className="absolute inset-0 border border-purple-400 rounded-full animate-spin" style={{animationDuration: '20s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-purple-400 rounded-full transform -translate-x-0.5 -translate-y-0.5"></div>
        </div>
      </div>

      {/* Main content container with fixed dimensions */}
      <div className="relative z-10 w-full max-w-4xl h-full max-h-screen flex flex-col p-4">
        
        {/* Compact header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-400 rounded-full mb-3 relative">
            <GraduationCap className="w-6 h-6 text-white" />
            <Sparkles className="absolute -top-0.5 -right-0.5 w-2 h-2 text-yellow-300" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-1">
            PhysicsLab
          </h1>
          <p className="text-slate-300 text-sm">Créez votre compte</p>
        </div>

        {/* Compact form in flexbox layout */}
        <div className="flex-1 flex gap-6 min-h-0">
          
          {/* Left column - Academic info */}
          <div className="flex-1 space-y-4">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/20 h-full flex flex-col">
              
              {/* Level selection */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-200 mb-2 flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  Niveau
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {['Tronc Commun', '1ère BAC', '2ème BAC'].map((niveau) => (
                    <label key={niveau} className={`flex items-center justify-center p-2 rounded-xl cursor-pointer transition-all text-xs ${
                      formData.niveau === niveau 
                        ? 'bg-purple-500/20 border border-purple-400 text-purple-300' 
                        : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/8'
                    }`}>
                      <input
                        type="radio"
                        name="niveau"
                        value={niveau}
                        checked={formData.niveau === niveau}
                        onChange={handleNiveauChange}
                        className="sr-only"
                      />
                      {niveau}
                    </label>
                  ))}
                </div>
              </div>

              {/* Stream selection - only show if not Tronc Commun */}
              {!isTroncCommunSelected && (
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-200 mb-2 flex items-center gap-1">
                    <FlaskConical className="w-3 h-3" />
                    Filière
                  </label>
                  <div className="grid grid-cols-1 gap-2 h-full">
                    {filiereData.map((filiere) => {
                      const IconComponent = filiere.icon;
                      const colors = getFiliereColors(filiere.code);
                      return (
                        <label key={filiere.code} className={`flex items-center p-3 rounded-xl cursor-pointer transition-all ${
                          formData.filiere === filiere.code 
                            ? `bg-gradient-to-r ${colors.bg} border ${colors.border} ${colors.text}` 
                            : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/8'
                        }`}>
                          <input
                            type="radio"
                            name="filiere"
                            value={filiere.code}
                            checked={formData.filiere === filiere.code}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <IconComponent className="w-4 h-4 mr-2" />
                          <div>
                            <div className="font-bold text-sm">{filiere.code}</div>
                            <div className="text-xs opacity-75">{filiere.desc}</div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Message for Tronc Commun */}
              {isTroncCommunSelected && (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center p-4">
                    <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-400 text-sm">
                      Niveau Tronc Commun sélectionné
                    </p>
                    <p className="text-slate-500 text-xs mt-1">
                      Aucune filière spécifique requise
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right column - Personal info */}
          <div className="flex-1 space-y-4">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/20 h-full flex flex-col space-y-3">
              
              {errors.general && (
                <div className="p-2 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <p className="text-red-400 text-xs">{errors.general}</p>
                </div>
              )}

              {/* High School and City fields */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1 flex items-center gap-1">
                    <School className="w-3 h-3" />
                    Nom du lycée
                  </label>
                  <input
                    type="text"
                    name="highSchoolName"
                    value={formData.highSchoolName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 bg-white/5 border rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-400 ${
                      errors.highSchoolName ? 'border-red-500/50' : 'border-white/10'
                    }`}
                    placeholder="Lycée Mohammed V"
                  />
                  {errors.highSchoolName && <p className="text-red-400 text-xs mt-1">{errors.highSchoolName}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Ville
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 bg-white/5 border rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-400 ${
                      errors.city ? 'border-red-500/50' : 'border-white/10'
                    }`}
                    placeholder="Casablanca"
                  />
                  {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
                </div>
              </div>

              {/* Name fields */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">Prénom</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 bg-white/5 border rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-400 ${
                      errors.firstName ? 'border-red-500/50' : 'border-white/10'
                    }`}
                    placeholder="Jean"
                  />
                  {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">Nom</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 bg-white/5 border rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-400 ${
                      errors.lastName ? 'border-red-500/50' : 'border-white/10'
                    }`}
                    placeholder="Dupont"
                  />
                  {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 bg-white/5 border rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-400 ${
                    errors.email ? 'border-red-500/50' : 'border-white/10'
                  }`}
                  placeholder="jean.dupont@student.ac.ma"
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">Mot de passe</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 pr-8 bg-white/5 border rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-400 ${
                        errors.password ? 'border-red-500/50' : 'border-white/10'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-2"
                    >
                      {showPassword ? <EyeOff className="w-3 h-3 text-slate-400" /> : <Eye className="w-3 h-3 text-slate-400" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">Confirmer</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 pr-8 bg-white/5 border rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-400 ${
                        errors.confirmPassword ? 'border-red-500/50' : 'border-white/10'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2 top-2"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3 h-3 text-slate-400" /> : <Eye className="w-3 h-3 text-slate-400" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>

              {/* Terms */}
              <div className="flex-1 flex flex-col justify-end">
                <label className="flex items-start cursor-pointer mb-3">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-purple-500 bg-white/10 border-white/20 rounded focus:ring-purple-400 mt-0.5"
                  />
                  <span className="ml-2 text-xs text-slate-300">
                    J'accepte les{' '}
                    <a href="/terms" className="text-purple-400 hover:text-purple-300 underline">conditions</a>
                  </span>
                </label>
                {errors.termsAccepted && <p className="text-red-400 text-xs mb-2">{errors.termsAccepted}</p>}

                {/* Submit button */}
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white py-2.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:scale-102 transition-all duration-300 disabled:opacity-50 text-sm"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Création...
                    </>
                  ) : (
                    <>
                      <GraduationCap className="w-4 h-4" />
                      Créer mon compte
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer links */}
        <div className="text-center mt-4 space-y-1">
          <p className="text-slate-300 text-sm">
            Déjà membre ?{' '}
            <a href="/login" className="text-purple-400 hover:text-purple-300 font-semibold">Se connecter</a>
          </p>
          <a href="/" className="text-slate-400 hover:text-slate-300 text-xs">← Retour à l'accueil</a>
        </div>
      </div>

      <style jsx>{`
        @keyframes floatParticle {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-100vh); }
        }
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default Signup;