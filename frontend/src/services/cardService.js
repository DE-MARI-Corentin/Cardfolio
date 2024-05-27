// src/services/cardService.js
const API_URL = 'http://localhost:3000/api';

export const getNewReleases = async () => {
  try {
    const response = await fetch(`${API_URL}/cards/latest`);
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};
