// Configuration des URLs de l'API
export const API_BASE_URL = 'http://localhost:3003';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    PROFILE: `${API_BASE_URL}/auth/profile`,
  },
  USERS: {
    BASE: `${API_BASE_URL}/users`,
    STAFF: `${API_BASE_URL}/users/staff`,
    DOCTORS: `${API_BASE_URL}/doctors`,
  },
  DOCTORS: {
    BASE: `${API_BASE_URL}/doctors`,
  },
  CLINICS: {
    BASE: `${API_BASE_URL}/clinics`,
    DOCTORS: (clinicId: string) => `${API_BASE_URL}/clinics/${clinicId}/doctors`,
  },
  APPOINTMENTS: {
    BASE: `${API_BASE_URL}/appointments`,
  },
  // Ajoutez d'autres endpoints au besoin
};

export default API_ENDPOINTS;
