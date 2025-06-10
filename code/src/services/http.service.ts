import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export class HttpService {
    private static instance: HttpService;
    private axiosInstance: AxiosInstance;

    private constructor() {
        this.axiosInstance = axios.create({
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
    }

    public static getInstance(): HttpService {
        if (!HttpService.instance) {
            HttpService.instance = new HttpService();
        }
        return HttpService.instance;
    }

    public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await this.axiosInstance.get<T>(url, config);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await this.axiosInstance.post<T>(url, data, config);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    private handleError(error: any): Error {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            throw new Error(`API Error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
        } else if (error.request) {
            // The request was made but no response was received
            throw new Error('No response received from server');
        } else {
            // Something happened in setting up the request that triggered an Error
            throw new Error(`Request Error: ${error.message}`);
        }
    }
} 