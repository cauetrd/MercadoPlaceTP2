export interface CookieOptions {
  expires?: Date;
  maxAge?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: "strict" | "lax" | "none";
}

export class CookieManager {
  static set(name: string, value: string, options: CookieOptions = {}): void {
    if (typeof document === "undefined") return;

    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(
      value
    )}`;

    if (options.expires) {
      cookieString += `; expires=${options.expires.toUTCString()}`;
    }

    if (options.maxAge) {
      cookieString += `; max-age=${options.maxAge}`;
    }

    if (options.path) {
      cookieString += `; path=${options.path}`;
    }

    if (options.domain) {
      cookieString += `; domain=${options.domain}`;
    }

    if (options.secure) {
      cookieString += `; secure`;
    }

    if (options.httpOnly) {
      cookieString += `; httponly`;
    }

    if (options.sameSite) {
      cookieString += `; samesite=${options.sameSite}`;
    }

    document.cookie = cookieString;
  }

  static get(name: string): string | null {
    if (typeof document === "undefined") return null;

    const nameEQ = `${encodeURIComponent(name)}=`;
    const cookies = document.cookie.split(";");

    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(cookie.substring(nameEQ.length));
      }
    }

    return null;
  }

  static remove(name: string, options: Partial<CookieOptions> = {}): void {
    if (typeof document === "undefined") return;

    this.set(name, "", {
      ...options,
      expires: new Date(0),
    });
  }

  static exists(name: string): boolean {
    return this.get(name) !== null;
  }

  static getAll(): Record<string, string> {
    if (typeof document === "undefined") return {};

    const cookies: Record<string, string> = {};
    const cookieArray = document.cookie.split(";");

    for (let cookie of cookieArray) {
      cookie = cookie.trim();
      const [name, value] = cookie.split("=");
      if (name && value) {
        cookies[decodeURIComponent(name)] = decodeURIComponent(value);
      }
    }

    return cookies;
  }
}
