// src/utils/apiUtils.js
import authService from '../services/authService';

export const API_BASE_URL = 'http://localhost:8080/api';

// Generic API request wrapper
export const apiRequest = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  console.log('🚀 API Request:', { 
    endpoint, 
    fullUrl: url, 
    method: options.method || 'GET',
    hasBody: !!options.body 
  });
  
  try {
    const response = await authService.authenticatedRequest(url, options);
    
    console.log('📡 API Response:', { 
      status: response.status, 
      statusText: response.statusText,
      url: response.url 
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ API Error:', errorData);
      
      const errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
      throw new Error(errorMessage);
    }
    
    const result = await response.json();
    console.log('✅ API Success:', result);
    
    if (result.status === 'error') {
      throw new Error(result.message || 'Request failed');
    }
    
    return result;
  } catch (error) {
    console.error('💥 API request failed:', { url, error: error.message });
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

  // Endpoints Cours
  courses: {
    getAll: (params) => apiRequest('/courses', { params }),
    getById: (id) => apiRequest(`/courses/${id}`),
    create: (data) => apiRequest('/courses', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiRequest(`/courses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    publish: (id) => apiRequest(`/courses/${id}/publish`, { method: 'POST' }),
    delete: (id) => apiRequest(`/courses/${id}`, { method: 'DELETE' }),
    getProgress: (id) => apiRequest(`/courses/${id}/progress`),
  },
  
  // Endpoints Examens
  exams: {
    getAll: (params) => apiRequest('/exams', { params }),
    getById: (id) => apiRequest(`/exams/${id}`),
    create: (data) => apiRequest('/exams', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiRequest(`/exams/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    publish: (id) => apiRequest(`/exams/${id}/publish`, { method: 'POST' }),
    delete: (id) => apiRequest(`/exams/${id}`, { method: 'DELETE' }),
    getResults: (id) => apiRequest(`/exams/${id}/results`),
    submitAnswer: (id, answers) => apiRequest(`/exams/${id}/submit`, { 
      method: 'POST', 
      body: JSON.stringify({ answers }) 
    }),
  },

  // Endpoints Quiz
  quizzes: {
    getAll: (params) => apiRequest('/quizzes', { params }),
    getById: (id) => apiRequest(`/quizzes/${id}`),
    create: (data) => apiRequest('/quizzes', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiRequest(`/quizzes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    publish: (id) => apiRequest(`/quizzes/${id}/publish`, { method: 'POST' }),
    delete: (id) => apiRequest(`/quizzes/${id}`, { method: 'DELETE' }),
    getResults: (id) => apiRequest(`/quizzes/${id}/results`),
    submitAnswer: (id, answers) => apiRequest(`/quizzes/${id}/submit`, { 
      method: 'POST', 
      body: JSON.stringify({ answers }) 
    }),
  },

  // Endpoints Analytics (Admin)
  analytics: {
    getDashboardStats: () => apiRequest('/analytics/dashboard'),
    getStudentProgress: (studentId) => apiRequest(`/analytics/students/${studentId}/progress`),
    getCourseStats: (courseId) => apiRequest(`/analytics/courses/${courseId}/stats`),
    getExamResults: (examId) => apiRequest(`/analytics/exams/${examId}/results`),
    getOverallPerformance: (params) => apiRequest('/analytics/performance', { params }),
  },

  // Endpoints Students (Admin)
  students: {
    getAll: (params) => apiRequest('/students', { params }),
    getById: (id) => apiRequest(`/students/${id}`),
    create: (data) => apiRequest('/students', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiRequest(`/students/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => apiRequest(`/students/${id}`, { method: 'DELETE' }),
    getProgress: (id) => apiRequest(`/students/${id}/progress`),
    getCourses: (id) => apiRequest(`/students/${id}/courses`),
    enrollToCourse: (studentId, courseId) => apiRequest(`/students/${studentId}/enroll`, {
      method: 'POST',
      body: JSON.stringify({ courseId })
    }),
    unenrollFromCourse: (studentId, courseId) => apiRequest(`/students/${studentId}/unenroll`, {
      method: 'POST',
      body: JSON.stringify({ courseId })
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

  // File upload endpoints
  files: {
    upload: (file, type = 'general') => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      
      return apiRequest('/files/upload', {
        method: 'POST',
        body: formData,
        // Ne pas définir Content-Type, le navigateur le fera automatiquement avec boundary
        headers: {}
      });
    },
    
    delete: (fileId) => apiRequest(`/files/${fileId}`, { method: 'DELETE' }),
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
  
  // Gestion des erreurs spécifiques
  if (error.message.includes('validation')) {
    return 'Données invalides. Vérifiez vos informations.';
  }
  
  if (error.message.includes('not found')) {
    return 'Ressource non trouvée.';
  }
  
  if (error.message.includes('forbidden')) {
    return 'Accès refusé. Vous n\'avez pas les permissions nécessaires.';
  }
  
  return error.message || 'Une erreur inattendue s\'est produite.';
};