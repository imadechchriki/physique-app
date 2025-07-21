import React from "react";
import { Mail } from "lucide-react";
import { useState } from "react";


function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      alert('Message envoyé! (Simulation)');
      setIsSubmitting(false);
      setFormData({ name: '', email: '', message: '' });
    }, 1000);
  };

  return (
    <div id="contact" className="py-20 bg-gradient-to-br  from-blue-900 via-blue-500 to-blue-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-cyan-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl font-bold text-white mb-4">Nous Contacter</h2>
          <p className="text-xl text-gray-300">
            Vous avez des questions ? Notre équipe est là pour vous aider.
          </p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Votre nom"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-4 bg-white/20 backdrop-blur-sm text-white placeholder-gray-300 rounded-xl border border-white/30 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all duration-300 transform focus:scale-105"
                required
              />
              <input
                type="email"
                placeholder="Votre email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-4 bg-white/20 backdrop-blur-sm text-white placeholder-gray-300 rounded-xl border border-white/30 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all duration-300 transform focus:scale-105"
                required
              />
            </div>
            <textarea
              placeholder="Votre message"
              rows="5"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="w-full p-4 bg-white/20 backdrop-blur-sm text-white placeholder-gray-300 rounded-xl border border-white/30 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all duration-300 resize-none transform focus:scale-105"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-4 rounded-xl hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 font-bold text-lg flex items-center justify-center gap-2 shadow-lg ${
                isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  Envoyer le message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;