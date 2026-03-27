import axios from 'axios';
import { TMDB_API_KEY } from '@env';

const apiClient = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: TMDB_API_KEY,
    language: 'en-US',
  },
  timeout: 10000,
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error(
        `API Error [${error.response.status}]:`,
        error.response.data?.status_message || 'Unknown error',
      );
    } else if (error.request) {
      console.error('Network Error: No response received');
    }
    return Promise.reject(error);
  },
);

export default apiClient;
