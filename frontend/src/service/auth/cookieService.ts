import { CookieManager } from "@/utils/cookies";
import { AuthResponse, UserResponseDto } from "../api/api.types";

const TOKEN_KEY = "access_token";
const USER_KEY = "user_data";
const REFRESH_KEY = "refresh_token";

export class CookieAuthService {
  // Token management
  static setToken(token: string): void {
    // Set token in both cookie and localStorage for backward compatibility
    CookieManager.set(TOKEN_KEY, token, {
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // Also set in localStorage for API compatibility
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token);
    }
  }

  static getToken(): string | null {
    // Try cookie first, then localStorage
    const cookieToken = CookieManager.get(TOKEN_KEY);
    if (cookieToken) return cookieToken;

    // Fallback to localStorage
    if (typeof window !== "undefined") {
      return localStorage.getItem(TOKEN_KEY);
    }

    return null;
  }

  static removeToken(): void {
    CookieManager.remove(TOKEN_KEY, { path: "/" });
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  // User data management
  static setUserData(user: UserResponseDto): void {
    CookieManager.set(USER_KEY, JSON.stringify(user), {
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }

  static getUserData(): UserResponseDto | null {
    const userData = CookieManager.get(USER_KEY);
    if (!userData) return null;

    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  }

  static removeUserData(): void {
    CookieManager.remove(USER_KEY, { path: "/" });
  }

  // Complete authentication management
  static setAuthData(authResponse: AuthResponse): void {
    this.setToken(authResponse.access_token);
    this.setUserData(authResponse.user);
  }

  static clearAuthData(): void {
    this.removeToken();
    this.removeUserData();
  }

  // Authentication checks
  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  static isAdmin(): boolean {
    const userData = this.getUserData();
    return userData?.isAdmin ?? false;
  }

  static getCurrentUser(): UserResponseDto | null {
    return this.getUserData();
  }

  // Token validation (basic check)
  static isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Basic JWT structure validation
      const parts = token.split(".");
      if (parts.length !== 3) return false;

      // Decode payload to check expiration
      const payload = JSON.parse(atob(parts[1]));
      const now = Math.floor(Date.now() / 1000);

      return payload.exp > now;
    } catch {
      return false;
    }
  }

  // Refresh token management (if needed)
  static setRefreshToken(refreshToken: string): void {
    CookieManager.set(REFRESH_KEY, refreshToken, {
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }

  static getRefreshToken(): string | null {
    return CookieManager.get(REFRESH_KEY);
  }

  static removeRefreshToken(): void {
    CookieManager.remove(REFRESH_KEY, { path: "/" });
  }
}
