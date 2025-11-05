/**
 * Type-safe localStorage wrapper service
 */

// Storage keys enum for type safety
export enum StorageKeys {
  USER = 'user',
  ACCESS_TOKEN = 'accessToken',
  REFRESH_TOKEN = 'refreshToken',
  THEME = 'theme',
  LANGUAGE = 'language',
  SEARCH_HISTORY = 'searchHistory',
  RECENT_SEARCHES = 'recentSearches',
}

class StorageService {
  /**
   * Get item from localStorage
   */
  getItem<T>(key: StorageKeys | string): T | null {
    try {
      const item = localStorage.getItem(key);

      if (!item) {
        return null;
      }

      // Try to parse as JSON, if fails return as string
      try {
        return JSON.parse(item) as T;
      } catch {
        return item as unknown as T;
      }
    } catch (error) {
      console.error(`Error getting item from localStorage: ${key}`, error);
      return null;
    }
  }

  /**
   * Set item in localStorage
   */
  setItem<T>(key: StorageKeys | string, value: T): boolean {
    try {
      const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error(`Error setting item in localStorage: ${key}`, error);
      return false;
    }
  }

  /**
   * Remove item from localStorage
   */
  removeItem(key: StorageKeys | string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing item from localStorage: ${key}`, error);
      return false;
    }
  }

  /**
   * Clear all items from localStorage
   */
  clear(): boolean {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage', error);
      return false;
    }
  }

  /**
   * Check if key exists in localStorage
   */
  hasItem(key: StorageKeys | string): boolean {
    return localStorage.getItem(key) !== null;
  }

  /**
   * Get all keys from localStorage
   */
  getAllKeys(): string[] {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        keys.push(key);
      }
    }
    return keys;
  }

  /**
   * Get localStorage size in bytes
   */
  getSize(): number {
    let size = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          size += key.length + value.length;
        }
      }
    }
    return size;
  }

  // Specific typed getters for common use cases
  getUser(): any | null {
    return this.getItem(StorageKeys.USER);
  }

  getAccessToken(): string | null {
    return this.getItem<string>(StorageKeys.ACCESS_TOKEN);
  }

  getRefreshToken(): string | null {
    return this.getItem<string>(StorageKeys.REFRESH_TOKEN);
  }

  getTheme(): 'light' | 'dark' | null {
    return this.getItem<'light' | 'dark'>(StorageKeys.THEME);
  }

  // Specific typed setters for common use cases
  setUser(user: any): boolean {
    return this.setItem(StorageKeys.USER, user);
  }

  setAccessToken(token: string): boolean {
    return this.setItem(StorageKeys.ACCESS_TOKEN, token);
  }

  setRefreshToken(token: string): boolean {
    return this.setItem(StorageKeys.REFRESH_TOKEN, token);
  }

  setTheme(theme: 'light' | 'dark'): boolean {
    return this.setItem(StorageKeys.THEME, theme);
  }

  // Clear auth data
  clearAuthData(): boolean {
    try {
      this.removeItem(StorageKeys.USER);
      this.removeItem(StorageKeys.ACCESS_TOKEN);
      this.removeItem(StorageKeys.REFRESH_TOKEN);
      return true;
    } catch (error) {
      console.error('Error clearing auth data', error);
      return false;
    }
  }
}

// Export singleton instance
export const storageService = new StorageService();
export default storageService;
