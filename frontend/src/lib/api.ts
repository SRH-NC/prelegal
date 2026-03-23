const BASE_URL = "";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(body.detail || res.statusText);
  }
  return res.json();
}

export interface UserInfo {
  id: string;
  email: string;
}

export function signUp(email: string, password: string) {
  return request<UserInfo>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function signIn(email: string, password: string) {
  return request<UserInfo>("/api/auth/signin", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function signOut() {
  return request<{ message: string }>("/api/auth/signout", { method: "POST" });
}

export function getMe() {
  return request<UserInfo>("/api/auth/me");
}
