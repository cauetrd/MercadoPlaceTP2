import ApiClient from "./api-wrapper";

const api = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

class ApiService {
  async get(path: string, headers?: object): Promise<any> {
    return await api.get(path, { headers });
  }

  async post(path: string, payload: any, headers?: object): Promise<any> {
    return await api.post(path, payload, { headers });
  }

  async patch(path: string, payload: any, headers?: object): Promise<any> {
    return await api.patch(path, payload, { headers });
  }

  async delete(path: string, headers?: object): Promise<any> {
    return await api.delete(path, { headers });
  }

  async put(path: string, payload: any, headers?: object): Promise<any> {
    return await api.put(path, payload, { headers });
  }
}

export const apiService = new ApiService();
