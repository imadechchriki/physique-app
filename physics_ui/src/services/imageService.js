// src/services/imageService.js
import authService from './authService';
import { API_BASE_URL } from '../utils/apiUtils';

export const imageService = {
  // Upload d'images pour un cours
  uploadCourseImages: async (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const token = await authService.getValidAccessToken();
    
    const response = await fetch(`${API_BASE_URL}/images/course/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json();
  },

  // Upload d'images pour un examen
  uploadExamImages: async (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const token = await authService.getValidAccessToken();
    
    const response = await fetch(`${API_BASE_URL}/images/exam/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json();
  },

  // Valider la disponibilité des images
  validateImages: async (filenames, context) => {
    return apiRequest('/images/validate', {
      method: 'POST',
      body: JSON.stringify({ filenames, context }),
    });
  },
};