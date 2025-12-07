// src/hooks/useApi.js
import { useState, useEffect, useCallback } from 'react';
import { api, handleApiError } from '../utils/apiUtils';
import { useAuth } from '../contexts/AuthContext';

// Generic API hook for data fetching
export const useApi = (apiFunction, dependencies = [], options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  
  const { 
    immediate = true, 
    onSuccess, 
    onError,
    transform 
  } = options;

  const execute = useCallback(async (...args) => {
    if (!isAuthenticated && apiFunction.toString().includes('authenticatedRequest')) {
      setError('Authentication required');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await apiFunction(...args);
      const transformedData = transform ? transform(result) : result;
      
      setData(transformedData);
      onSuccess?.(transformedData);
      return transformedData;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, isAuthenticated, transform, onSuccess, onError]);

  useEffect(() => {
    if (immediate && isAuthenticated) {
      execute();
    }
  }, [...dependencies, immediate, isAuthenticated]);

  return {
    data,
    loading,
    error,
    execute,
    refetch: execute,
  };
};

// Hook for user profile management
export const useUserProfile = () => {
  const { user } = useAuth();
  
  const {
    data: profile,
    loading: profileLoading,
    error: profileError,
    execute: fetchProfile,
  } = useApi(api.users.getProfile, [], { immediate: false });

  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  const updateProfile = useCallback(async (profileData) => {
    setUpdateLoading(true);
    setUpdateError(null);
    
    try {
      const updatedProfile = await api.users.updateProfile(profileData);
      await fetchProfile(); // Refresh profile data
      return updatedProfile;
    } catch (error) {
      const errorMessage = handleApiError(error);
      setUpdateError(errorMessage);
      throw error;
    } finally {
      setUpdateLoading(false);
    }
  }, [fetchProfile]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user, fetchProfile]);

  return {
    profile: profile || user,
    profileLoading,
    profileError,
    updateProfile,
    updateLoading,
    updateError,
    refetchProfile: fetchProfile,
  };
};

// Hook for physics exercises
export const useExercises = (filters = {}) => {
  const {
    data: exercises,
    loading,
    error,
    execute: fetchExercises,
  } = useApi(
    () => api.physics.getExercises(filters),
    [JSON.stringify(filters)],
    {
      transform: (result) => result.data || result,
    }
  );

  return {
    exercises: exercises || [],
    loading,
    error,
    refetch: fetchExercises,
  };
};

// Hook for exercise submission
export const useExerciseSubmission = () => {
  const [submissions, setSubmissions] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitAnswer = useCallback(async (exerciseId, answer) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await api.physics.submitAnswer(exerciseId, answer);
      
      setSubmissions(prev => ({
        ...prev,
        [exerciseId]: {
          ...result,
          submittedAt: new Date(),
        },
      }));
      
      return result;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getSubmission = useCallback((exerciseId) => {
    return submissions[exerciseId];
  }, [submissions]);

  return {
    submitAnswer,
    getSubmission,
    submissions,
    loading,
    error,
  };
};

// Hook for local storage with error handling
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

// Hook for debounced values
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};