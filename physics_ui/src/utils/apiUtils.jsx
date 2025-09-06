// src/utils/apiUtils.js
import authService from '../services/authService';

export const API_BASE_URL = 'http://localhost:8080/api';

// Generic API request wrapper
export const apiRequest = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await authService.authenticatedRequest(url, options);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      // Extract error message from backend response
      const errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
      throw new Error(errorMessage);
    }
    
    const result = await response.json();
    
    // Check if backend returned an error status
    if (result.status === 'error') {
      throw new Error(result.message || 'Request failed');
    }
    
    return result;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Specific API methods
export const api = {
  // Auth endpoints
  auth: {
    login: (email, password, rememberMe) => 
      authService.login(email, password, rememberMe),
    
    logout: () => 
      authService.logout(),
    
    refreshToken: () => 
      authService.refreshAccessToken(),
    
    getCurrentUser: () => 
      authService.getCurrentUser(),
  },

  // User endpoints
  users: {
    getProfile: () => 
      apiRequest('/users/profile'),
    
    updateProfile: (profileData) => 
      apiRequest('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      }),
    
    changePassword: (currentPassword, newPassword) => 
      apiRequest('/users/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      }),
  },

  // Example endpoints for your physics app
  physics: {
    getExercises: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return apiRequest(`/exercises${queryString ? `?${queryString}` : ''}`);
    },
    
    getExerciseById: (id) => 
      apiRequest(`/exercises/${id}`),
    
    submitAnswer: (exerciseId, answer) => 
      apiRequest(`/exercises/${exerciseId}/submit`, {
        method: 'POST',
        body: JSON.stringify({ answer }),
      }),
    
    getResults: () => 
      apiRequest('/results'),
  },
};

// Error handling utilities
export const handleApiError = (error) => {
  if (error.message === 'Authentication failed') {
    // Redirect to login will be handled by AuthContext
    return 'Session expirée. Veuillez vous reconnecter.';
  }
  
  if (error.message.includes('Network')) {
    return 'Erreur de connexion. Vérifiez votre connexion internet.';
  }
  
  return error.message || 'Une erreur inattendue s\'est produite.';
};