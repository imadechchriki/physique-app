// src/services/authService.js
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:8080/api';
const TOKEN_EXPIRY_BUFFER = 5 * 60 * 1000; // 5 minutes before actual expiry

class AuthService {
  constructor() {
    this.accessToken = null;
    this.refreshToken = null;
    this.user = null;
    this.tokenExpiresAt = null;
    this.refreshPromise = null;
    
    // Initialize from cookies on service creation
    this.initializeFromStorage();
  }

  // Initialize tokens and user data from cookies
  initializeFromStorage() {
    try {
      const accessToken = Cookies.get('accessToken');
      const refreshToken = Cookies.get('refreshToken');
      const user = Cookies.get('user');
      const expiresAt = Cookies.get('tokenExpiresAt');

      if (accessToken && refreshToken && user && expiresAt) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.user = JSON.parse(user);
        this.tokenExpiresAt = new Date(expiresAt);
      }
    } catch (error) {
      console.error('Error initializing auth from storage:', error);
      this.clearStorage();
    }
  }

  // Convert array timestamp to Date object
  parseTimestamp(timestampArray) {
    if (!timestampArray || timestampArray.length < 6) return null;
    
    const [year, month, day, hour, minute, second, nano] = timestampArray;
    // Note: month is 1-based in the array but 0-based in Date constructor
    return new Date(year, month - 1, day, hour, minute, second, Math.floor(nano / 1000000));
  }

  // Store tokens and user data in cookies
  storeTokens(data) {
    const { accessToken, refreshToken, user, expiresAt } = data;
    
    // Parse the timestamp array to Date
    const expiryDate = this.parseTimestamp(expiresAt);
    
    // Store in memory
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.user = user;
    this.tokenExpiresAt = expiryDate;

    // Store in cookies with appropriate expiry
    const cookieOptions = {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    };

    Cookies.set('accessToken', accessToken, cookieOptions);
    Cookies.set('refreshToken', refreshToken, cookieOptions);
    Cookies.set('user', JSON.stringify(user), cookieOptions);
    Cookies.set('tokenExpiresAt', expiryDate?.toISOString(), cookieOptions);
  }

  // Clear all stored data
  clearStorage() {
    this.accessToken = null;
    this.refreshToken = null;
    this.user = null;
    this.tokenExpiresAt = null;
    this.refreshPromise = null;

    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    Cookies.remove('user');
    Cookies.remove('tokenExpiresAt');
  }

  // Login method
  async login(email, password, rememberMe = false) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }

      if (result.status === 'success' && result.data) {
        this.storeTokens(result.data);
        return result.data;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Logout method
  async logout() {
    try {
      // Optional: Call logout endpoint if your API has one
      // await fetch(`${API_BASE_URL}/auth/logout`, {
      //   method: 'POST',
      //   headers: this.getAuthHeaders(),
      // });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearStorage();
    }
  }

  // Check if token needs refresh
  shouldRefreshToken() {
    if (!this.tokenExpiresAt || !this.refreshToken) return false;
    
    const now = new Date();
    const timeUntilExpiry = this.tokenExpiresAt.getTime() - now.getTime();
    
    return timeUntilExpiry <= TOKEN_EXPIRY_BUFFER;
  }

  // Refresh access token
  async refreshAccessToken() {
    // Prevent multiple concurrent refresh requests
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    this.refreshPromise = this.performTokenRefresh();
    
    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.refreshPromise = null;
    }
  }

  async performTokenRefresh() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Extract error message from backend response
        const errorMessage = result.message || 'Token refresh failed';
        throw new Error(errorMessage);
      }

      if (result.status === 'success' && result.data) {
        this.storeTokens(result.data);
        return result.data;
      } else {
        // Handle case where response is OK but status is not success
        const errorMessage = result.message || 'Invalid refresh response format';
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      // If refresh fails, clear storage and redirect to login
      this.clearStorage();
      throw error;
    }
  }

  // Get current access token, refreshing if necessary
  async getValidAccessToken() {
    if (!this.accessToken) {
      throw new Error('No access token available');
    }

    if (this.shouldRefreshToken()) {
      try {
        await this.refreshAccessToken();
      } catch (error) {
        throw new Error('Failed to refresh token');
      }
    }

    return this.accessToken;
  }

  // Get authorization headers
  getAuthHeaders() {
    return {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    };
  }

  // Make authenticated API request
  async authenticatedRequest(url, options = {}) {
    try {
      const token = await this.getValidAccessToken();
      
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // If we get 401, try to refresh token once
      if (response.status === 401 && this.refreshToken) {
        try {
          await this.refreshAccessToken();
          const newToken = await this.getValidAccessToken();
          
          return fetch(url, {
            ...options,
            headers: {
              ...options.headers,
              'Authorization': `Bearer ${newToken}`,
              'Content-Type': 'application/json',
            },
          });
        } catch (refreshError) {
          // Refresh failed, redirect to login
          this.clearStorage();
          throw new Error('Authentication failed');
        }
      }

      return response;
    } catch (error) {
      console.error('Authenticated request error:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!(this.accessToken && this.refreshToken && this.user);
  }

  // Get current user
  getCurrentUser() {
    return this.user;
  }

  // Get access token (for external use)
  getAccessToken() {
    return this.accessToken;
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService;