// src/services/courseService.js
import { apiRequest, API_BASE_URL } from '../utils/apiUtils';

export const courseService = {
  // Récupérer tous les cours avec filtres
  getCourses: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/courses${queryString ? `?${queryString}` : ''}`);
  },

  // Récupérer un cours spécifique avec ses sections
  getCourse: async (courseId) => {
    const response = await apiRequest(`/courses/${courseId}`);
    
    // Enrichir les URLs des images
    if (response.data?.images) {
      response.data.images = response.data.images.map(img => ({
        ...img,
        url: img.url || `${API_BASE_URL}/images/course/${img.filename}`
      }));
    }
    
    return response;
  },

  // Créer un nouveau cours (Admin)
  createCourse: async (courseData) => {
    return apiRequest('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  },

  // Mettre à jour un cours (Admin)
  updateCourse: async (courseId, courseData) => {
    return apiRequest(`/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    });
  },

  // Publier un cours (Admin)
  publishCourse: async (courseId) => {
    return apiRequest(`/courses/${courseId}/publish`, {
      method: 'POST',
    });
  },

  // Supprimer un cours (Admin)
  deleteCourse: async (courseId) => {
    return apiRequest(`/courses/${courseId}`, {
      method: 'DELETE',
    });
  },

  // Rechercher des cours
  searchCourses: async (query, page = 0, size = 10) => {
    return apiRequest(`/courses/search?query=${encodeURIComponent(query)}&page=${page}&size=${size}`);
  },

  // Récupérer les cours populaires
  getPopularCourses: async (limit = 10) => {
    return apiRequest(`/courses/popular?limit=${limit}`);
  },

  // Récupérer les cours récents
  getRecentCourses: async (limit = 10) => {
    return apiRequest(`/courses/recent?limit=${limit}`);
  },

  // Progress tracking (Student)
  getCourseProgress: async (courseId) => {
    return apiRequest(`/courses/${courseId}/progress`);
  },

  // Marquer une section comme complétée (Student)
  markSectionComplete: async (courseId, sectionId) => {
    return apiRequest(`/courses/${courseId}/sections/${sectionId}/complete`, {
      method: 'POST',
    });
  },
};



