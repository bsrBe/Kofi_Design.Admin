import api from './api';

export const adminService = {
  login: async (credentials: any) => {
    const response = await api.post('/admin/login', credentials);
    if (response.data.success && response.data.token) {
        localStorage.setItem('admin_token', response.data.token);
    }
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/admin/me');
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get('/orders/stats');
    return response.data;
  },

  getOrders: async (page = 1, limit = 10, status?: string, isRush?: boolean) => {
    const params: any = { page, limit };
    if (status && status !== 'All') params.status = status;
    if (isRush) params.rush = 'true';
    const response = await api.get('/orders', { params });
    return response.data;
  },

  getClients: async (page = 1, limit = 20) => {
    const response = await api.get('/users', { params: { page, limit } });
    return response.data;
  },

  getOrderById: async (id: string) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  sendQuote: async (orderId: string, basePrice: number) => {
    const response = await api.patch(`/orders/${orderId}/quote`, { basePrice });
    return response.data;
  },

  confirmDeposit: async (orderId: string) => {
    const response = await api.patch(`/orders/${orderId}/confirm-deposit`);
    return response.data;
  },

  updateStatus: async (orderId: string, status: string) => {
    const response = await api.patch(`/orders/${orderId}/status`, { status });
    return response.data;
  },

  createOrder: async (data: any) => {
    const response = await api.post('/orders/manual', data);
    return response.data;
  },

  getRevisions: async (orderId: string) => {
    const response = await api.get(`/revisions/order/${orderId}`);
    return response.data;
  },

  updateRevisionStatus: async (revisionId: string, status: string) => {
    const response = await api.patch(`/revisions/admin/status/${revisionId}`, { status });
    return response.data;
  },
  
  // Collections
  getCollections: async () => {
    const response = await api.get('/collections');
    return response.data;
  },

  addCollectionItem: async (formData: FormData) => {
    const response = await api.post('/collections', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  updateCollectionItem: async (id: string, formData: FormData) => {
    const response = await api.put(`/collections/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  deleteCollectionItem: async (id: string) => {
    const response = await api.delete(`/collections/${id}`);
    return response.data;
  },

  // Security
  changePassword: async (data: any) => {
    const response = await api.post('/admin/change-password', data);
    return response.data;
  },

  setupSecurity: async (data: any) => {
    const response = await api.post('/admin/setup-security', data);
    return response.data;
  },

  getSecretQuestion: async (email: string) => {
    const response = await api.post('/admin/forgot-password/question', { email });
    return response.data;
  },

  resetPassword: async (data: any) => {
    const response = await api.post('/admin/forgot-password/reset', data);
    return response.data;
  }
};
