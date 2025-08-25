import React from 'react';
import { Navigate } from 'react-router-dom';

// Mock authentication hook - remplacez par votre vraie logique d'auth
const useAuth = () => {
  // Simule un utilisateur connecté - remplacez par votre logique réelle
  return {
    isAuthenticated: true, // true si l'utilisateur est connecté
    user: {
      role: 'admin', // 'admin' ou 'student'
      name: 'John Doe',
      email: 'john@example.com'
    }
  };
};

// Composant pour protéger les routes selon le rôle
const ProtectedRoute = ({ 
  children, 
  requiredRole = null, // 'admin', 'student', ou null pour tout utilisateur connecté
  redirectTo = '/login' 
}) => {
  const { isAuthenticated, user } = useAuth();

  // Si pas connecté, rediriger vers login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Si un rôle spécifique est requis
  if (requiredRole && user.role !== requiredRole) {
    // Rediriger vers le dashboard approprié selon le rôle
    const defaultRedirect = user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';
    return <Navigate to={defaultRedirect} replace />;
  }

  return children;
};

// Composant pour rediriger automatiquement selon le rôle après connexion
const RoleBasedRedirect = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Rediriger vers le dashboard approprié
  const redirectPath = user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';
  return <Navigate to={redirectPath} replace />;
};

// Hook pour obtenir les informations utilisateur dans les composants
const useUser = () => {
  const { user } = useAuth();
  return user;
};

export { ProtectedRoute, RoleBasedRedirect, useUser };