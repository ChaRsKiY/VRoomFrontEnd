import axios from 'axios';

const api = axios.create({
     //baseURL: 'http://localhost:5024/api',
     baseURL: "https://c7ad-195-230-183-105.ngrok-free.app/api",
     headers: {
          'ngrok-skip-browser-warning': 'true',
     },
});

export default api;