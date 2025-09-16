import React, { useState } from 'react';
import { User, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LogoutButton, { LogoutMenuItem } from './LogoutButton';

const DashboardHeader = ({ title, subtitle }) => {
  const { user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogoutSuccess = () => {
    console.log('User logged out successfully');
    // You can add any additional cleanup here
  };

  const handleLogoutError = (error) => {
    console.error('Logout failed:', error);
    // You can show a toast notification here
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Page Title */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && (
              <p className="text-sm text-gray-600">{subtitle}</p>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {/* User Info */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">
                  {user?.fullName || `${user?.firstName} ${user?.lastName}`}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role?.toLowerCase()}
                </p>
              </div>
            </div>

            {/* Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <a
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <User className="w-4 h-4" />
                    Mon Profil
                  </a>
                  <a
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Settings className="w-4 h-4" />
                    Paramètres
                  </a>
                  <hr className="my-1" />
                  <LogoutMenuItem
                    onSuccess={handleLogoutSuccess}
                    onError={handleLogoutError}
                  />
                </div>
              )}
            </div>

            {/* Alternative: Direct Logout Button */}
            <div className="hidden lg:block">
              <LogoutButton
                variant="outline"
                size="sm"
                showIcon={true}
                showText={false}
                onSuccess={handleLogoutSuccess}
                onError={handleLogoutError}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Alternative */}
      <div className="lg:hidden px-4 pb-3">
        <LogoutButton
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onSuccess={handleLogoutSuccess}
          onError={handleLogoutError}
        />
      </div>
    </header>
  );
};

export default DashboardHeader;