import "server-only";

export const BACKEND_URL = (
  process.env.CLIPFORGE_BACKEND_URL ??
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  ""
).replace(/\/$/, "");

export class BackendError extends Error {
  status: number;
  detail?: string;
  constructor(status: number, message: string, detail?: string) {
    super(message);
    this.status = status;
    this.detail = detail;
  }
}

interface BackendOptions {
  signal?: AbortSignal;
}

export async function backendFetch<T>(
  path: string,
  init: RequestInit & BackendOptions = {},
): Promise<T> {
  if (!BACKEND_URL) {
    throw new BackendError(
      500,
      "CLIPFORGE_BACKEND_URL is not configured on the server.",
    );
  }
  const url = `${BACKEND_URL}${path}`;
  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        ...(init.headers ?? {}),
      },
      cache: "no-store",
    });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    throw new BackendError(
      502,
      `ClipForge backend at ${BACKEND_URL} isn't responding. It may still be starting up — try again in a moment, or check it's running.`,
      detail,
    );
  }

  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const body = data as { error?: string; detail?: string } | null;
    throw new BackendError(
      res.status,
      body?.error ?? `Backend responded ${res.status}.`,
      body?.detail,
    );
  }

  return data as T;
}
