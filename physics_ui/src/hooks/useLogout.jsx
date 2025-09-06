// src/hooks/useLogout.js
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const useLogout = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async (options = {}) => {
    const { 
      redirectTo = '/login', 
      showConfirmation = true,
      onSuccess,
      onError
    } = options;

    // Show confirmation dialog if requested
    if (showConfirmation) {
      const confirmed = window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?');
      if (!confirmed) return;
    }

    setIsLoggingOut(true);

    try {
      await logout();
      
      // Call success callback if provided
      onSuccess?.();
      
      // Redirect to specified page
      navigate(redirectTo);
    } catch (error) {
      console.error('Logout error:', error);
      
      // Call error callback if provided
      onError?.(error);
      
      // Even if logout API fails, redirect to login page
      // since local storage has been cleared
      navigate(redirectTo);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return {
    handleLogout,
    isLoggingOut,
  };
};