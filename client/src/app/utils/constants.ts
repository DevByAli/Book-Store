export const BASE_URL = 'http://localhost:50001/api/v1';
export const usernamePattern = /^[a-zA-Z\s]+$/;
export const passwordPattern =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
export const STATUS = {
  delivered: 'delivered',
  processing: 'processing',
  shipped: 'shipped',
  pending: 'pending',
  cancelled: 'cancelled',
};
