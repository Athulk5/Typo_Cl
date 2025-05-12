import axios from 'axios';

const apiClient = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.DEV 
    ? 'http://localhost:5000/api' 
    : 'https://typo-se.onrender.com/api',
  timeout: 10000
});

export const fetchText = async (options) => {
  try {
    const response = await apiClient.post('/generate-text', {
      time: options.time,
      type: options.type,
      difficulty: options.difficulty
    });

    if (response.status !== 200 || !response.data?.text) {
      throw new Error('Invalid server response');
    }
    
    return response.data.text;
  } catch (error) {
    console.error('Connection Error:', {
      message: error.message,
      code: error.code,
      config: error.config?.url
    });
    return null;
  }
};

export const updateUserWPM = async (wpm) => {  
  try {
    const response = await apiClient.post('/leaderboard/update-wpm', { wpm });
    return response.data;
  } catch (error) {
    console.error('Error updating WPM:', error.response?.data || error.message);
    
    // Handle unauthorized case
    if (error.response?.status === 401) {
      console.log('User not logged in - score not saved');
    }
    
    throw error;
  }
};

export const fetchLeaderboard = async () => {
  try {
    const response = await apiClient.get('/leaderboard');
    return response.data;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
};