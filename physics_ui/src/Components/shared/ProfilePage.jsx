import React from 'react';
import DashboardLayout from '../shared/DashboardLayout';

const ProfilePage = ({ userRole = "admin" }) => (
  <DashboardLayout
    currentPage="profile"
    pageTitle="Mon Profil"
    pageSubtitle="Gérez vos informations personnelles et préférences"
    userName={userRole === "admin" ? "Admin" : "Étudiant"}
    userRole={userRole}
  >
    <div className="space-y-6">
      {/* Informations de base */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Informations personnelles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              placeholder="Votre nom complet"
              defaultValue="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input 
              type="email" 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              placeholder="votre@email.com"
              defaultValue="john.doe@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
            <input 
              type="tel" 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              placeholder="+33 6 12 34 56 78"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rôle</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" 
              value={userRole === 'admin' ? 'Administrateur' : 'Étudiant'}
              disabled
            />
          </div>
        </div>
      </div>

      {/* Photo de profil */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Photo de profil</h3>
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
            JD
          </div>
          <div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-3">
              Changer la photo
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Supprimer
            </button>
          </div>
        </div>
      </div>

      {/* Préférences */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Préférences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Notifications par email</p>
              <p className="text-sm text-gray-600">Recevoir les notifications importantes par email</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6"></span>
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Mode sombre</p>
              <p className="text-sm text-gray-600">Utiliser le thème sombre de l'interface</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1"></span>
            </button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          Annuler
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Sauvegarder
        </button>
      </div>
    </div>
  </DashboardLayout>
);

export default ProfilePage;