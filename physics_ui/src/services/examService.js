// src/services/examService.js
import { apiRequest, API_BASE_URL } from '../utils/apiUtils';

export const examService = {
  // Récupérer tous les examens avec filtres
  getExams: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/exams${queryString ? `?${queryString}` : ''}`);
  },

  // Récupérer un examen spécifique
  getExam: async (examId) => {
    const response = await apiRequest(`/exams/${examId}`);
    
    // Enrichir les URLs des images
    if (response.data?.images) {
      response.data.images = response.data.images.map(img => ({
        ...img,
        url: img.url || `${API_BASE_URL}/images/exam/${img.filename}`
      }));
    }
    
    return response;
  },

  // Créer un nouvel examen (Admin)
  createExam: async (examData) => {
    return apiRequest('/exams', {
      method: 'POST',
      body: JSON.stringify(examData),
    });
  },

  // Mettre à jour un examen (Admin)
  updateExam: async (examId, examData) => {
    return apiRequest(`/exams/${examId}`, {
      method: 'PUT',
      body: JSON.stringify(examData),
    });
  },

  // Publier un examen (Admin)
  publishExam: async (examId) => {
    return apiRequest(`/exams/${examId}/publish`, {
      method: 'POST',
    });
  },

  // Supprimer un examen (Admin)
  deleteExam: async (examId) => {
    return apiRequest(`/exams/${examId}`, {
      method: 'DELETE',
    });
  },

  // Soumettre les réponses d'un examen (Student)
  submitExamAnswers: async (examId, answers) => {
    return apiRequest(`/exams/${examId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });
  },

  // Récupérer les résultats d'un examen (Student)
  getExamResults: async (examId) => {
    return apiRequest(`/exams/${examId}/results`);
  },
};