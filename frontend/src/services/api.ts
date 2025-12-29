import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth Service
export const authService = {
  signup: async (data: { name: string; email: string; password: string }) => {
    const response = await api.post('/auth/signup', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/login', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

// Event Service
export const eventService = {
  getAllEvents: async (params?: { 
    search?: string; 
    category?: string; 
    page?: number; 
    limit?: number 
  }) => {
    const response = await api.get('/events', { params });
    return response.data;
  },

  getEventById: async (id: string) => {
    if (!id || id === 'undefined' || id === 'null') {
      throw new Error('Invalid event ID');
    }
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  createEvent: async (formData: FormData) => {
    const response = await api.post('/events', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateEvent: async (id: string, formData: FormData) => {
    if (!id || id === 'undefined' || id === 'null') {
      throw new Error('Invalid event ID');
    }
    const response = await api.put(`/events/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteEvent: async (id: string) => {
    if (!id || id === 'undefined' || id === 'null') {
      throw new Error('Invalid event ID');
    }
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },

  rsvpEvent: async (id: string) => {
    if (!id || id === 'undefined' || id === 'null') {
      throw new Error('Invalid event ID');
    }
    const response = await api.post(`/events/${id}/rsvp`);
    return response.data;
  },

  cancelRsvp: async (id: string) => {
    if (!id || id === 'undefined' || id === 'null') {
      throw new Error('Invalid event ID');
    }
    const response = await api.delete(`/events/${id}/rsvp`);
    return response.data;
  },

  getUserEvents: async () => {
    const response = await api.get('/users/events');
    return response.data;
  },

  // AI Description Generator
  generateDescription: async (eventData: {
    title: string;
    category?: string;
    location?: string;
    date?: string;
    time?: string;
    capacity?: number;
    existingDescription?: string;
  }) => {
    const response = await api.post('/events/generate-description', eventData);
    return response.data;
  },
};

export default api;