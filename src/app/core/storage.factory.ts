import { LocalStorageCacheService, MemoryCacheService } from '@ngx-cache/platform-browser';

export function storageFactory(platformId: any) {
  try {
    localStorage.setItem('test', '');
    localStorage.removeItem('test');
    return new LocalStorageCacheService(platformId);
  } catch {
    return new MemoryCacheService(platformId);
  }
}
