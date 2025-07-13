import { CookieAuthService } from "../auth/cookieService";
import ApiClient from "./api-wrapper";
import { AuthResponse } from "./api.types";

const api = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  withCredentials: true,
});

class ApiService {
  private getAuthHeaders(customHeaders?: object) {
    const token = CookieAuthService.getToken();
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
    return { ...authHeaders, ...customHeaders };
  }

  private async handleAuthError(error: any) {
    if (error.response?.status === 401) {
      // Token expired or invalid
      CookieAuthService.clearAuthData();

      // Redirect to login if we're in the browser
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    throw error;
  }

  async get(path: string, headers?: object): Promise<any> {
    try {
      return await api.get(path, { headers: this.getAuthHeaders(headers) });
    } catch (error) {
      return this.handleAuthError(error);
    }
  }

  async post(path: string, payload: any, headers?: object): Promise<any> {
    try {
      return await api.post(path, payload, {
        headers: this.getAuthHeaders(headers),
      });
    } catch (error) {
      return this.handleAuthError(error);
    }
  }

  async patch(path: string, payload: any, headers?: object): Promise<any> {
    try {
      return await api.patch(path, payload, {
        headers: this.getAuthHeaders(headers),
      });
    } catch (error) {
      return this.handleAuthError(error);
    }
  }

  async delete(path: string, headers?: object): Promise<any> {
    try {
      return await api.delete(path, { headers: this.getAuthHeaders(headers) });
    } catch (error) {
      return this.handleAuthError(error);
    }
  }

  async put(path: string, payload: any, headers?: object): Promise<any> {
    try {
      return await api.put(path, payload, {
        headers: this.getAuthHeaders(headers),
      });
    } catch (error) {
      return this.handleAuthError(error);
    }
  }

  async login(credentials: { email: string; password: string }) {
    const response = (await api.post(
      "/auth/login",
      credentials
    )) as AuthResponse;
    if (response.access_token) {
      CookieAuthService.setAuthData(response);
    }
    return response;
  }

  async register(userData: any) {
    const response = (await api.post(
      "/auth/register",
      userData
    )) as AuthResponse;
    if (response.access_token) {
      CookieAuthService.setAuthData(response);
    }
    return response;
  }

  async logout() {
    CookieAuthService.clearAuthData();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  getCurrentUser() {
    return CookieAuthService.getCurrentUser();
  }

  isAuthenticated() {
    return CookieAuthService.isAuthenticated();
  }

  isAdmin() {
    return CookieAuthService.isAdmin();
  }
}

export const apiService = new ApiService();
