export class HttpClient {
  constructor(
    private readonly baseUrl: string,
    private readonly getAuthToken?: () => Promise<string | null>,
  ) {}

  async get<T>(path: string, params?: Record<string, string | undefined>): Promise<T> {
    const url = this.buildUrl(path, params);
    const response = await fetch(url, {
      method: 'GET',
      headers: await this.buildHeaders(),
    });
    return this.parseResponse<T>(response);
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    const headers = await this.buildHeaders();
    const init: RequestInit = {
      method: 'POST',
      headers,
    };
    if (body !== undefined) {
      init.headers = { ...headers, 'Content-Type': 'application/json' };
      init.body = JSON.stringify(body);
    }
    const response = await fetch(`${this.baseUrl}${path}`, init);
    return this.parseResponse<T>(response);
  }

  async put<T>(path: string, body: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'PUT',
      headers: {
        ...(await this.buildHeaders()),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return this.parseResponse<T>(response);
  }

  private buildUrl(path: string, params?: Record<string, string | undefined>): string {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== '') {
          url.searchParams.set(key, value);
        }
      }
    }
    return url.toString();
  }

  private async buildHeaders(): Promise<HeadersInit> {
    const headers: Record<string, string> = {};
    const token = await this.getAuthToken?.();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const body = (await response.json().catch(() => ({}))) as { error?: string };
      throw new Error(body.error ?? `Request failed with status ${response.status}`);
    }
    return response.json() as Promise<T>;
  }
}

export function createHttpClient(getAuthToken?: () => Promise<string | null>): HttpClient {
  const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3005';
  return new HttpClient(baseUrl, getAuthToken);
}
