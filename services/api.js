import axios from 'axios';

// Substitua pela sua chave de API da RAWG
const API_KEY = '11633be77f5e49c29ef5e3babc7021b7';
const BASE_URL = 'https://api.rawg.io/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  params: {
    key: API_KEY,
  },
});

export const fetchGames = async () => {
  try {
    const response = await apiClient.get('/games', {
      params: {
        page_size: 20,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar jogos:', error);
    throw error;
  }
};

export const searchGames = async (query) => {
  try {
    const response = await apiClient.get('/games', {
      params: {
        search: query,
        page_size: 20,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar jogos:', error);
    throw error;
  }
};

export const fetchGameDetails = async (id) => {
  try {
    const response = await apiClient.get(`/games/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar detalhes do jogo:', error);
    throw error;
  }
};