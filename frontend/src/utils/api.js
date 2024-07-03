import axios from 'axios';

const api = axios.create({
  baseURL: 'https://expense-tracker-657a.onrender.com'
});

export default api;
