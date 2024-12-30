import axios from 'axios';

const api = axios.create({
     baseURL: 'http://localhost:5024/api',
  //  baseURL: 'http://95.217.212.221:5024/api',
});

export default api;