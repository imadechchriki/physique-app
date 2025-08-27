import React from 'react';
import {
  BookOpen,
  Zap,
  Target
} from 'lucide-react';

const AboutOwnerSection = () => {
  return (
    <section id="about" className="py-20 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-20 right-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-60 h-60 bg-cyan-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            À propos du <span className="text-cyan-600">créateur</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Découvrez l'enseignant passionné derrière cette plateforme innovante
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Profile Image Section */}
            <div className="relative bg-gradient-to-br from-cyan-500 to-blue-600 p-8 lg:p-12 flex items-center justify-center">
              <div className="relative">
                <div className="w-64 h-64 bg-white/10 backdrop-blur-sm rounded-2xl border-2 border-white/20 flex items-center justify-center shadow-2xl">
                  <div className="text-center text-white">
                    <div className="w-120 h-120 rounded-full mx-auto mb-4 overflow-hidden border-4 border-white/30 shadow-lg">

                      <img
                        src="/images/profile.jpg"
                        alt="Photo de Zakaryae Chriki"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm opacity-80">Photo de profil</p>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>

              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20v20h20z'/%3E%3C/g%3E%3C/svg%3E")`
                  }}
                ></div>
              </div>
            </div>

            {/* Profile Info Section */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="space-y-6">
                <div>
                  <h3 className="text-3xl font-bold text-slate-800 mb-2">Zakaryae Chriki</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Professeur de Physique
                    </div>
                    <div className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm">
                      Depuis 2014
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-slate-600 leading-relaxed">
                    J'enseigne depuis 2014 à des élèves de tous niveaux (de 5ème à la Terminale) et de profils très diversifiés. 
                    Parce qu'aucun élève n'apprend de la même manière et au même rythme, mais que tous doivent maîtriser 
                    les connaissances et les compétences du socle commun, je les engage dans un apprentissage actif à travers 
                    la différenciation pédagogique.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    Je recherche constamment à adapter mon enseignement pour la réussite des élèves (gestion du temps de classe, 
                    organisation des apprentissages, utilisation des outils numériques, projets pédagogiques, etc.).
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 py-6">
                  <div className="text-center p-4 bg-slate-50 rounded-xl">
                    <div className="text-2xl font-bold text-cyan-600">10+</div>
                    <div className="text-sm text-slate-600">Années d'expérience</div>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">500+</div>
                    <div className="text-sm text-slate-600">Élèves formés</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-slate-800">Contact & Réseaux</h4>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="mailto:contact@physicseval.com"
                      className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-full transition-all duration-200 transform hover:scale-105"
                    >
                      <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                      Email
                    </a>
                    <a
                      href="#"
                      className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-full transition-all duration-200 transform hover:scale-105"
                    >
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      LinkedIn
                    </a>
                    <a
                      href="#"
                      className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-full transition-all duration-200 transform hover:scale-105"
                    >
                      <div className="w-4 h-4 bg-slate-800 rounded-full"></div>
                      Site web
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold text-slate-800 mb-2">Pédagogie Active</h4>
            <p className="text-slate-600 text-sm">Apprentissage différencié adapté à chaque élève</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold text-slate-800 mb-2">Innovation Numérique</h4>
            <p className="text-slate-600 text-sm">Outils modernes pour l'enseignement de la physique</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold text-slate-800 mb-2">Réussite Élèves</h4>
            <p className="text-slate-600 text-sm">Accompagnement personnalisé vers l'excellence</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutOwnerSection;
