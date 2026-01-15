export class StorageService {
  get<T>(key: string, defaultValue: T): T {
    try {
      const value = localStorage.getItem(key);
      return value ? (JSON.parse(value) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }
}

export const storageService = new StorageService();
