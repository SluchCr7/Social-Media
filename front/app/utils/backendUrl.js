export const BACKEND_URL = (
  process.env.NEXT_PUBLIC_BACK_URL || 'http://localhost:3001'
).replace(/\/+$/, '');

export const API_BASE_URL = `${BACKEND_URL}/api`;
