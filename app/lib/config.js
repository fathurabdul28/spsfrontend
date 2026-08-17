export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
export const STORAGE_BASE_URL = process.env.NEXT_PUBLIC_STORAGE_URL || 'http://localhost:8000/storage';


export function getImageUrl(path, fallback = '/pendidikan.jpg') {
  if (!path) return fallback;
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path.replace(/([^:]\/)\/+/g, "$1");
  }
  // If path is a local public asset (starts with '/' and doesn't look like a storage path name)
  if (path.startsWith('/') && !path.startsWith('/storage/')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const fullUrl = `${STORAGE_BASE_URL}${cleanPath}`;
  return fullUrl.replace(/([^:]\/)\/+/g, "$1");
}
