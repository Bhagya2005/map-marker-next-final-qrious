// API Service for Next.js App Router
// Uses /api routes instead of external backend

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const apiService = {

  async register(email: string, username: string, password: string, role: 'admin' | 'regular' = 'regular') {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password, role }),
    });
    return response.json();
  },

  async login(email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  async getProfile(token: string) {
    const response = await fetch(`${API_URL}/auth/profile`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
  },

  async updateProfile(token: string, username?: string, password?: string) {
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ username, password }),
    });
    return response.json();
  },

  // Pin endpoints
  async getPins(token?: string) {
    const headers: any = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(`${API_URL}/pins`, { headers });
    return response.json();
  },

  async createPin(token: string, pin: any) {
    const response = await fetch(`${API_URL}/pins`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(pin),
    });
    return response.json();
  },

  async updatePin(token: string, id: string, pin: any) {
    const response = await fetch(`${API_URL}/pins/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(pin),
    });
    return response.json();
  },

  async deletePin(token: string, id: string) {
    const response = await fetch(`${API_URL}/pins/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
  },

  // Feedback endpoints
  async submitFeedback(token: string, feedback: any) {
    const response = await fetch(`${API_URL}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(feedback),
    });
    return response.json();
  },

  async getFeedback(token: string) {
    const response = await fetch(`${API_URL}/feedback`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
  },

  // Category endpoints
  async getCategories() {
    const response = await fetch(`${API_URL}/categories`);
    return response.json();
  },

  async createCategory(token: string, name: string, color: string) {
    const response = await fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ name, color }),
    });
    return response.json();
  },

  // Theme endpoints
  async getThemes() {
    const response = await fetch(`${API_URL}/themes`);
    return response.json();
  },

  async getDefaultTheme() {
    const response = await fetch(`${API_URL}/themes/default`);
    return response.json();
  },

  // Admin endpoints
  async getUsers(token: string) {
    const response = await fetch(`${API_URL}/users`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
  },

  async getWalkthroughs() {
    const response = await fetch(`${API_URL}/walkthroughs`);
    return response.json();
  },

  async createWalkthrough(token: string, walkthrough: any) {
    const response = await fetch(`${API_URL}/walkthroughs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(walkthrough),
    });
    return response.json();
  },
};
