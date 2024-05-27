// src/services/collectionService.js
const API_URL = 'https://your-backend-url.com/api';

export const getCollection = async (section) => {
  try {
    const response = await fetch(`${API_URL}/collection?section=${section}`);
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};
