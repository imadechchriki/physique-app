import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Mail, Lock, Eye, EyeOff, Atom, ArrowRight, FlaskConical, Zap, Sparkles } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [focusedField, setFocusedField] = useState(null);

  // Memoized particles to prevent regeneration on every render
  const particles = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.3 + 0.05,
      opacity: Math.random() * 0.4 + 0.1,
      delay: Math.random() * 2
    }));
  }, []);

  // Throttled mouse move handler
  const handleMouseMove = useCallback((e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    setMousePosition({ x, y });
  }, []);

  // Debounced mouse move effect
  useEffect(() => {
    let timeoutId;
    const throttledHandler = (e) => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => {
        handleMouseMove(e);
        timeoutId = null;
      }, 16); // ~60fps
    };

    window.addEventListener('mousemove', throttledHandler, { passive: true });
    return () => {
      window.removeEventListener('mousemove', throttledHandler);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [handleMouseMove]);

  // Memoized background style to prevent recalculation
  const backgroundStyle = useMemo(() => ({
    background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
      rgba(168, 85, 247, 0.3) 0%, 
      rgba(59, 130, 246, 0.2) 25%, 
      rgba(6, 182, 212, 0.1) 50%,
      transparent 70%)`
  }), [mousePosition.x, mousePosition.y]);

  // Memoized physics formulas
  const physicsFormulas = useMemo(() => [
    { text: 'E = mc²', style: { top: '10%', left: '10%' }, delay: 0 },
    { text: 'F = ma', style: { top: '20%', right: '16%' }, delay: 2 },
    { text: 'λ = h/p', style: { top: '40%', left: '20%' }, delay: 4 },
    { text: 'ΔS ≥ 0', style: { bottom: '30%', right: '20%' }, delay: 6 },
    { text: '∇ × B = μ₀J', style: { bottom: '16%', left: '16%' }, delay: 8 }
  ], []);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.email, formData.password]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      console.log('Login attempt:', formData);
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Connexion réussie!');
    } catch (error) {
      setErrors({ general: 'Erreur de connexion. Veuillez réessayer.' });
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateForm]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Optimized Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Reduced particle count for better performance */}
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-purple-400 rounded-full will-change-transform"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: particle.opacity,
              transform: `scale(${particle.size})`,
              animation: `floatParticle ${3 + particle.speed * 10}s ${particle.delay}s infinite linear`
            }}
          />
        ))}
        
        {/* Optimized gradient overlay with will-change */}
        <div 
          className="absolute inset-0 opacity-25 transition-all duration-1000 will-change-transform"
          style={backgroundStyle}
        />
        
        {/* Static mesh background - removed animation for performance */}
        <div className="absolute inset-0 opacity-8">
          <div className="absolute inset-0" 
            style={{
              backgroundImage: `radial-gradient(circle at 25% 75%, rgba(139, 69, 197, 0.2) 0%, transparent 40%),
                               radial-gradient(circle at 75% 25%, rgba(59, 130, 246, 0.2) 0%, transparent 40%),
                               radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.15) 0%, transparent 40%)`
            }}
          />
        </div>
        
        {/* Optimized physics formulas */}
        <div className="absolute inset-0 opacity-6 text-white font-light overflow-hidden pointer-events-none">
          {physicsFormulas.map((formula, index) => (
            <div
              key={index}
              className="absolute text-xl will-change-transform"
              style={{
                ...formula.style,
                animation: `gentleFloat 8s ${formula.delay}s infinite ease-in-out`
              }}
            >
              {formula.text}
            </div>
          ))}
        </div>

        {/* Simplified atom orbits */}
        <div className="absolute top-20 right-20 w-32 h-32 opacity-12 will-change-transform">
          <div className="absolute inset-0 border border-purple-400 rounded-full animate-spin" style={{animationDuration: '20s'}}></div>
          <div className="absolute inset-4 border border-blue-400 rounded-full animate-spin" style={{animationDuration: '15s', animationDirection: 'reverse'}}></div>
          <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-purple-400 rounded-full transform -translate-x-1 -translate-y-1"></div>
        </div>

        <div className="absolute bottom-20 left-20 w-24 h-24 opacity-12 will-change-transform">
          <div className="absolute inset-0 border border-cyan-400 rounded-full animate-spin" style={{animationDuration: '25s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full transform -translate-x-0.5 -translate-y-0.5"></div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Header */}
        <div className="text-center mb-10 animate-fadeInUp">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 rounded-full mb-6 relative group hover:scale-105 transition-transform duration-300 will-change-transform">
            <Atom className="w-10 h-10 text-white" />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 rounded-full blur-md opacity-50"></div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            PhysicsLab
          </h1>
          <p className="text-slate-300 text-lg mb-3">
            Plateforme d'évaluation et d'apprentissage
          </p>
          <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
            <FlaskConical className="w-4 h-4" />
            <span>Sciences Physiques Avancées</span>
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        {/* Login Form */}
        <div className="space-y-6 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl relative overflow-hidden group will-change-transform">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-cyan-500/5 rounded-3xl"></div>
            
            <div className="relative z-10">
              {/* General Error */}
              {errors.general && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl backdrop-blur-sm animate-shake">
                  <p className="text-red-400 text-sm flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    {errors.general}
                  </p>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-3 mb-6">
                <label htmlFor="email" className="block text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Adresse email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className={`h-5 w-5 transition-colors duration-200 ${
                      focusedField === 'email' ? 'text-purple-400' : 'text-slate-400'
                    }`} />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full pl-12 pr-4 py-4 bg-white/5 border rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-200 backdrop-blur-sm hover:bg-white/8 will-change-auto ${
                      errors.email ? 'border-red-500/50 ring-2 ring-red-500/20' : 'border-white/10 hover:border-white/30'
                    }`}
                    placeholder="votre@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-sm flex items-center gap-1 animate-fadeIn">
                    <Zap className="w-3 h-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-3 mb-6">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Mot de passe
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className={`h-5 w-5 transition-colors duration-200 ${
                      focusedField === 'password' ? 'text-purple-400' : 'text-slate-400'
                    }`} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full pl-12 pr-14 py-4 bg-white/5 border rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-200 backdrop-blur-sm hover:bg-white/8 will-change-auto ${
                      errors.password ? 'border-red-500/50 ring-2 ring-red-500/20' : 'border-white/10 hover:border-white/30'
                    }`}
                    placeholder="••••••••••"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:scale-105 transition-transform duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-slate-400 hover:text-purple-400 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-slate-400 hover:text-purple-400 transition-colors" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-sm flex items-center gap-1 animate-fadeIn">
                    <Zap className="w-3 h-3" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between mb-8">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-purple-500 bg-white/10 border-white/20 rounded focus:ring-purple-400 focus:ring-2 accent-purple-500 transition-transform hover:scale-105"
                  />
                  <span className="ml-3 text-sm text-slate-300 group-hover:text-slate-200 transition-colors">
                    Se souvenir de moi
                  </span>
                </label>
                <a 
                  href="/forgot-password" 
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200 hover:underline"
                >
                  Mot de passe oublié ?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 text-white py-4 px-6 rounded-2xl font-semibold flex items-center justify-center gap-3 hover:scale-102 hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group will-change-transform"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-center gap-3">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Connexion en cours...</span>
                    </>
                  ) : (
                    <>
                      <Atom className="w-5 h-5" />
                      Se connecter
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center mt-8 animate-fadeInUp" style={{animationDelay: '0.4s'}}>
          <p className="text-slate-300">
            Nouveau sur PhysicsLab ?{' '}
            <a 
              href="/signup" 
              className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-200 hover:underline"
            >
              Créer un compte
            </a>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-4 animate-fadeInUp" style={{animationDelay: '0.6s'}}>
          <a 
            href="/" 
            className="text-slate-400 hover:text-slate-300 text-sm transition-colors duration-200 hover:underline inline-flex items-center gap-1"
          >
            ← Retour à l'accueil
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes floatParticle {
          0% { transform: translateY(0px) scale(var(--scale)); }
          100% { transform: translateY(-100vh) scale(var(--scale)); }
        }
        
        @keyframes gentleFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          75% { transform: translateX(3px); }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
        
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default Login;