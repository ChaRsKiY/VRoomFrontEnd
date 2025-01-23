import axios from 'axios';

const api = axios.create({
    baseURL: 'https://localhost:7154/api',
 //  baseURL: 'http://95.217.212.221:5024/api',

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