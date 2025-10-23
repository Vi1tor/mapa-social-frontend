import { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email, senha) => {
    try {
      const response = await authService.login(email, senha);
      const { token, usuario } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(usuario));
      setUser(usuario);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao fazer login'
      };
    }
  };

  const register = async (data) => {
    try {
      const response = await authService.register(data);
      const { token, usuario } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(usuario));
      setUser(usuario);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao criar conta'
      };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: authService.isAuthenticated(),
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
