import React from 'react';
import { Target, CheckCircle, Star } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-cyan-600 to-blue-700 text-white text-center">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <h2 className="text-4xl md:text-5xl font-bold">Prêt à transformer votre enseignement ?</h2>
        <p className="text-xl text-cyan-100">Rejoignez des centaines de professeurs qui utilisent déjà la plateforme.</p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button onClick={() => window.location.href = '/login'} className="bg-white text-cyan-600 px-8 py-4 rounded-xl font-bold hover:scale-105 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Commencer gratuitement
          </button>
          <button className="border-2 border-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-cyan-600">
            Planifier une démo
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-8 pt-8 text-cyan-100">
          <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Gratuit 30 jours</div>
          <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Aucune carte requise</div>
          <div className="flex items-center gap-2"><Star className="w-5 h-5" /> Support 24/7</div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
