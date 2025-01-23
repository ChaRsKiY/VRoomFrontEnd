import axios from 'axios';

const api = axios.create({
     //baseURL: 'http://localhost:5024/api',
     baseURL: "https://c7ad-195-230-183-105.ngrok-free.app/api",
     headers: {
          'ngrok-skip-browser-warning': 'true',
     },
});

// Додаємо перехоплювач для обробки помилок
api.interceptors.response.use(
response => response,
error => {
    console.error('API Error:', error);
    return Promise.reject(error);
}
);

export default api;