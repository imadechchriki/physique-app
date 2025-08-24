import React from 'react';
import DashboardLayout from '../../shared/DashboardLayout';

const AnalyticsPage = () => (
  <DashboardLayout
    currentPage="analytics"
    pageTitle="Analytics & Statistiques"
    pageSubtitle="Analysez les performances de la plateforme"
    userName="Admin"
    userRole="admin"
  >
    <div className="space-y-6">
      {/* Stats globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Utilisateurs actifs</p>
              <p className="text-3xl font-bold text-gray-900">1,234</p>
              <p className="text-xs text-green-600 mt-1">+12% ce mois</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cours créés</p>
              <p className="text-3xl font-bold text-gray-900">89</p>
              <p className="text-xs text-blue-600 mt-1">+5 cette semaine</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taux de réussite</p>
              <p className="text-3xl font-bold text-gray-900">85%</p>
              <p className="text-xs text-green-600 mt-1">+3% vs mois dernier</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Temps moyen</p>
              <p className="text-3xl font-bold text-gray-900">2h15</p>
              <p className="text-xs text-purple-600 mt-1">par session</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques et analyses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique des inscriptions */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Inscriptions mensuelles</h3>
            <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
              <option>6 derniers mois</option>
              <option>12 derniers mois</option>
              <option>Cette année</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between space-x-2">
            <div className="flex flex-col items-center">
              <div className="w-8 bg-blue-500 rounded-t-lg mb-2" style={{height: '60%'}}></div>
              <span className="text-xs text-gray-600">Jan</span>
              <span className="text-xs font-medium text-gray-900">145</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 bg-blue-500 rounded-t-lg mb-2" style={{height: '75%'}}></div>
              <span className="text-xs text-gray-600">Fév</span>
              <span className="text-xs font-medium text-gray-900">187</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 bg-blue-500 rounded-t-lg mb-2" style={{height: '85%'}}></div>
              <span className="text-xs text-gray-600">Mar</span>
              <span className="text-xs font-medium text-gray-900">212</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 bg-blue-500 rounded-t-lg mb-2" style={{height: '95%'}}></div>
              <span className="text-xs text-gray-600">Avr</span>
              <span className="text-xs font-medium text-gray-900">236</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 bg-blue-500 rounded-t-lg mb-2" style={{height: '70%'}}></div>
              <span className="text-xs text-gray-600">Mai</span>
              <span className="text-xs font-medium text-gray-900">174</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 bg-blue-500 rounded-t-lg mb-2" style={{height: '100%'}}></div>
              <span className="text-xs text-gray-600">Juin</span>
              <span className="text-xs font-medium text-gray-900">248</span>
            </div>
          </div>
        </div>

        {/* Répartition par niveau */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Répartition des étudiants par niveau</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Lycée (Terminale)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: '45%'}}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">45%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Lycée (Première)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '35%'}}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">35%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Lycée (Seconde)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{width: '20%'}}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">20%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tableau des matières les plus populaires */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Matières les plus populaires</h3>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">Voir tout</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Matière</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Étudiants inscrits</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Taux de completion</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Note moyenne</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Évolution</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Mathématiques</p>
                      <p className="text-sm text-gray-600">Terminale S</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-900 font-medium">456</td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '87%'}}></div>
                    </div>
                    <span className="text-sm text-gray-600">87%</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-900 font-medium">16.2/20</td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    +5.2%
                  </span>
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Physique-Chimie</p>
                      <p className="text-sm text-gray-600">Terminale S</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-900 font-medium">389</td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{width: '73%'}}></div>
                    </div>
                    <span className="text-sm text-gray-600">73%</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-900 font-medium">14.8/20</td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    +2.1%
                  </span>
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Histoire-Géographie</p>
                      <p className="text-sm text-gray-600">Terminale</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-900 font-medium">312</td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '91%'}}></div>
                    </div>
                    <span className="text-sm text-gray-600">91%</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-900 font-medium">15.6/20</td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    -1.3%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Activité récente */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Activité récente de la plateforme</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Nouveau cours créé</p>
                <p className="text-sm text-gray-600">Un nouveau cours de "Fonctions exponentielles" a été ajouté en Mathématiques Terminale</p>
                <p className="text-xs text-gray-500 mt-1">Il y a 2 heures</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Nouvel étudiant inscrit</p>
                <p className="text-sm text-gray-600">Marie Dupont s'est inscrite et a rejoint la classe de Première S</p>
                <p className="text-xs text-gray-500 mt-1">Il y a 4 heures</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Quiz complété en masse</p>
                <p className="text-sm text-gray-600">45 étudiants ont terminé le quiz "Les équations du second degré"</p>
                <p className="text-xs text-gray-500 mt-1">Il y a 6 heures</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Actions rapides</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-sm font-medium text-gray-900">Créer un cours</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm font-medium text-gray-900">Ajouter un étudiant</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-sm font-medium text-gray-900">Générer rapport</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
);

export default AnalyticsPage;