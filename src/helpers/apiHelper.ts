import { DELCOM_BASEURL } from "@/lib/config";
import type { ApiResult } from "@/types";

const ACCESS_TOKEN_KEY = "accessToken";

export const BASE_URL = DELCOM_BASEURL;

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function putAccessToken(token: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function removeAccessToken(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

function buildQuery(params?: Record<string, string | number | null | undefined>) {
  const query = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, String(value));
    }
  });
  const text = query.toString();
  return text ? `?${text}` : "";
}

export interface ApiFetchOptions {
  method?: string;
  params?: Record<string, string | number | null | undefined>;
  body?: Record<string, string | number>;
  formData?: FormData;
  auth?: boolean;
}

type RawBody = Partial<ApiResult> & { status?: string };

/**
 * Menentukan berhasil/tidaknya sebuah respons API.
 * Mendukung { success: boolean }, { status: "success" | "fail" },
 * dan sebagai cadangan memakai status HTTP (response.ok).
 */
function isSuccess(body: RawBody, response: Response): boolean {
  if (typeof body.success === "boolean") return body.success;
  if (typeof body.status === "string") {
    return body.status.toLowerCase() === "success";
  }
  return response.ok;
}

/**
 * Wrapper fetch ke REST API Delcom.
 * Menangani query params, bearer token, body urlencoded / FormData,
 * dan selalu mengembalikan { success, message, data }.
 */
export async function apiFetch<T = unknown>(
  path: string,
  { method = "GET", params, body, formData, auth = true }: ApiFetchOptions = {}
): Promise<ApiResult<T>> {
  const headers: Record<string, string> = {};

  if (auth) {
    const token = getAccessToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const options: RequestInit = { method, headers };

  if (formData) {
    options.body = formData;
  } else if (body) {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    const encoded = new URLSearchParams();
    Object.entries(body).forEach(([key, value]) =>
      encoded.append(key, String(value))
    );
    options.body = encoded.toString();
  }

  try {
    const response = await fetch(
      `${BASE_URL}${path}${buildQuery(params)}`,
      options
    );
    const body = (await response.json()) as RawBody;
    return { ...body, success: isSuccess(body, response) } as ApiResult<T>;
  } catch (error) {
    return { success: false, message: (error as Error).message, data: null };
  }
}
