import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (email, senha) => api.post('/auth/login', { email, senha }),
  register: (data) => api.post('/auth/register', data),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  isAuthenticated: () => !!localStorage.getItem('token'),
};

export const categoriaService = {
  listar: () => api.get('/categorias'),
  buscar: (id) => api.get(`/categorias/${id}`),
};

export const servicoService = {
  listar: () => api.get('/servicos'),
  buscar: (id) => api.get(`/servicos/${id}`),
  listarPorCategoria: (categoriaId) => api.get(`/servicos/categoria/${categoriaId}`),
  buscarPorTermo: (termo) => api.get(`/servicos/buscar?termo=${termo}`),
};

export const sugestaoService = {
  criar: (data) => api.post('/sugestoes', data),
  criarAnonima: (data) => api.post('/sugestoes/anonima', data),
  listarMinhas: () => api.get('/sugestoes/minhas'),
};

export const favoritoService = {
  listar: () => api.get('/favoritos'),
  adicionar: (servicoId) => api.post(`/favoritos/${servicoId}`),
  remover: (servicoId) => api.delete(`/favoritos/${servicoId}`),
};

export default api;
