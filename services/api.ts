import { User } from '../types';

// This is a placeholder for the Xano API URL.
// In a real application, this should be configured in an environment variable.
const API_BASE_URL = process.env.XANO_API_URL || 'https://x8ki-letl-twmt.n7.xano.io/api:c93451il';

const getAuthToken = (): string | null => {
    try {
        return localStorage.getItem('authToken');
    } catch (error) {
        console.error("Could not access localStorage", error);
        return null;
    }
};

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
        console.error("API Error:", errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    // Handle cases where the response body might be empty (e.g., DELETE requests)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json();
    }
    return null; 
};

// FIX: Add interface to properly type the api object and its methods.
interface ApiMethods {
    request<T>(endpoint: string, options?: RequestInit): Promise<T>;
    get<T>(endpoint: string): Promise<T>;
    post<T>(endpoint: string, data: any): Promise<T>;
    put<T>(endpoint: string, data: any): Promise<T>;
    delete<T>(endpoint: string): Promise<T>;
    upload(file: File): Promise<{ path: string; url: string }>;
}

const api: ApiMethods = {
    async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const token = getAuthToken();
        const headers = new Headers(options.headers || {});
        
        if (!(options.body instanceof FormData)) {
             headers.set('Content-Type', 'application/json');
        }
       
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        return handleResponse(response);
    },

    get<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'GET' });
    },

    post<T>(endpoint: string, data: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    
    put<T>(endpoint: string, data: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    delete<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE' });
    },

    upload: async (file: File): Promise<{ path: string; url: string }> => {
        const formData = new FormData();
        // Xano's upload endpoint often expects the content in a field named 'content'
        formData.append('content', file);

        const response = await fetch(`${API_BASE_URL}/upload/attachment`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
            },
            body: formData,
        });
        
        const data = await handleResponse(response);
        // Assuming Xano returns a relative path, construct the full URL
        return { path: data.path, url: `${API_BASE_URL.replace('/api:c93451il', '')}${data.path}` };
    }
};

export const logActivity = async (action: string, details: object) => {
    try {
        await api.post('/activity_logs', {
            action,
            details: JSON.stringify(details),
        });
    } catch (error) {
        console.error("Error logging activity: ", error);
    }
};

export const createNotification = async (userId: string, title: string, description: string) => {
    try {
        await api.post('/notifications', {
            userId,
            title,
            description,
            timestamp: new Date().toISOString(),
            read: false,
        });
    } catch (error) {
        console.error("Error creating notification: ", error);
    }
};


export default api;