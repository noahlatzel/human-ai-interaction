import { API_URL } from './config';

export class ApiError<T = unknown> extends Error {
  status: number;
  data?: T;

  constructor(message: string, status: number, data?: T) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

let accessTokenGetter: (() => string | null) | null = null;

export const setAccessTokenGetter = (getter: (() => string | null) | null) => {
  accessTokenGetter = getter;
};

const buildUrl = (path: string) => {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_URL}${normalizedPath}`;
};

async function request<TResponse>(path: string, options: RequestOptions = {}): Promise<TResponse> {
  const { method = 'GET', body, headers = {}, signal } = options;
  const token = accessTokenGetter?.() ?? null;

  const finalHeaders: Record<string, string> = { ...headers };
  if (body !== undefined) {
    finalHeaders['Content-Type'] = finalHeaders['Content-Type'] ?? 'application/json';
  }
  if (token) {
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(buildUrl(path), {
    method,
    headers: finalHeaders,
    credentials: 'include',
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });

  const contentType = response.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message = isJson && data && typeof data === 'object' && 'detail' in data
      ? String((data as { detail?: unknown }).detail)
      : response.statusText || 'Request failed';
    throw new ApiError(message, response.status, data);
  }

  return data as TResponse;
}

export const apiClient = {
  get: <TResponse>(path: string, options: Omit<RequestOptions, 'method' | 'body'> = {}) =>
    request<TResponse>(path, { ...options, method: 'GET' }),
  post: <TResponse, TBody = unknown>(path: string, body: TBody, options: Omit<RequestOptions, 'method' | 'body'> = {}) =>
    request<TResponse>(path, { ...options, method: 'POST', body }),
  delete: <TResponse = unknown>(path: string, options: Omit<RequestOptions, 'method' | 'body'> = {}) =>
    request<TResponse>(path, { ...options, method: 'DELETE' }),
};
