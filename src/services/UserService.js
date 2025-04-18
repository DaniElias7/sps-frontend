import axios from 'axios';
import { AUTH_LOGIN_ENDPOINT, USERS_ENDPOINT, USER_ENDPOINT } from '../constants';

const API_BASE_URL = process.env.REACT_APP_SERVER_URL;

class UserService {
  async login(credentials) {
    try {
      const response = await axios.post(`${API_BASE_URL}${AUTH_LOGIN_ENDPOINT}`, credentials);
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error.response?.data?.message || 'Falha ao fazer login';
    }
  }

  async list(token) {
    try {
      const response = await axios.get(`${API_BASE_URL}${USERS_ENDPOINT}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      throw error.response?.data?.message || 'Falha ao buscar usuários';
    }
  }

  async get(id, token) {
    try {
      const response = await axios.get(`${API_BASE_URL}${USER_ENDPOINT(id)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar usuário com ID ${id}:`, error);
      throw error.response?.data?.message || `Falha ao buscar usuário com ID ${id}`;
    }
  }

  async create(data, token) {
    try {
      const response = await axios.post(`${API_BASE_URL}${USERS_ENDPOINT}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error.response?.data?.message || 'Falha ao criar usuário';
    }
  }

  async update(id, data, token) {
    try {
      const response = await axios.put(`${API_BASE_URL}${USER_ENDPOINT(id)}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar usuário com ID ${id}:`, error);
      throw error.response?.data?.message || `Falha ao atualizar usuário com ID ${id}`;
    }
  }

  async delete(id, token) {
    try {
      await axios.delete(`${API_BASE_URL}${USER_ENDPOINT(id)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return true; // Indicate successful deletion
    } catch (error) {
      console.error(`Erro ao excluir usuário com ID ${id}:`, error);
      throw error.response?.data?.message || `Falha ao excluir usuário com ID ${id}`;
    }
  }
}

export default new UserService(); // Export an instance of the class