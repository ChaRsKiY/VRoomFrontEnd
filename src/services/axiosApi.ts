import axios from 'axios';

const api = axios.create({
     //baseURL: 'http://localhost:5024/api',
     baseURL: "/webapi"
});

export default api;