import ApiClient from "./api-wrapper";

const api = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

class ApiService {
  // Helper method to get auth headers from localStorage
  private getAuthHeaders(customHeaders?: object) {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
    return { ...authHeaders, ...customHeaders };
  }

  async get(path: string, headers?: object): Promise<any> {
    return await api.get(path, { headers: this.getAuthHeaders(headers) });
  }

  async post(path: string, payload: any, headers?: object): Promise<any> {
    return await api.post(path, payload, {
      headers: this.getAuthHeaders(headers),
    });
  }

  async patch(path: string, payload: any, headers?: object): Promise<any> {
    return await api.patch(path, payload, {
      headers: this.getAuthHeaders(headers),
    });
  }

  async delete(path: string, headers?: object): Promise<any> {
    return await api.delete(path, { headers: this.getAuthHeaders(headers) });
  }

  async put(path: string, payload: any, headers?: object): Promise<any> {
    return await api.put(path, payload, {
      headers: this.getAuthHeaders(headers),
    });
  }
}

export const apiService = new ApiService();
