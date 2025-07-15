import axios from 'axios';

// Cambia esta URL por la de tu Cloud Function en Google Cloud
const VISION_FUNCTION_URL = 'https://REGION-PROJECT.cloudfunctions.net/analyzeVideo';

export const analyzeVideo = async (videoUrl) => {
  try {
    const response = await axios.post(VISION_FUNCTION_URL, { videoUrl });
    return response.data; // { threatDetected: true/false, details: ... }
  } catch (error) {
    throw new Error('Error al analizar el video.');
  }
}; 