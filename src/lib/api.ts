import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import Cookies from 'universal-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

class APIService {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    //this.instance.interceptors.request.use(this.addAuthToken.bind(this));
  }

  // Метод для додавання токена автентифікації з Cookies
  private addAuthToken(config: AxiosRequestConfig): AxiosRequestConfig {
    const cookies = new Cookies();
    const token = cookies.get('authToken'); // отримуємо токен з Cookies
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  }

  // GET-запит
  public async get<T>(url: string, params?: object): Promise<T> {
    const response = await this.instance.get<T>(url, { params });
    return response.data;
  }

  // POST-запит
  public async post<T>(url: string, data?: object): Promise<T> {
    const response = await this.instance.post<T>(url, data);
    return response.data;
  }

  // PUT-запит
  public async put<T>(url: string, data?: object): Promise<T> {
    const response = await this.instance.put<T>(url, data);
    return response.data;
  }

  // DELETE-запит
  public async delete<T>(url: string): Promise<T> {
    const response = await this.instance.delete<T>(url);
    return response.data;
  }
}

// Експорт екземпляра класу APIService
export const API = new APIService();
