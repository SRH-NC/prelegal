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

// Chat types and API

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  message: string;
  document_type: string | null;
  extracted_fields: Record<string, string>;
  is_complete: boolean;
}

export interface GreetingResponse {
  message: string;
}

export function getChatGreeting() {
  return request<GreetingResponse>("/api/chat/greeting");
}

export function sendChatMessage(history: ChatMessage[], message: string) {
  return request<ChatResponse>("/api/chat/message", {
    method: "POST",
    body: JSON.stringify({ history, message }),
  });
}

// Document types and API

export interface SavedDocument {
  id: string;
  title: string;
  doc_type: string;
  fields: Record<string, string>;
  created_at: string;
}

export function listDocuments() {
  return request<SavedDocument[]>("/api/documents");
}

export function saveDocument(title: string, doc_type: string, fields: Record<string, string>) {
  return request<SavedDocument>("/api/documents", {
    method: "POST",
    body: JSON.stringify({ title, doc_type, fields }),
  });
}

export function deleteDocument(id: string) {
  return fetch(`/api/documents/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
}

// Template API

export async function getTemplate(docType: string): Promise<string> {
  const res = await fetch(`/api/templates/${docType}`);
  if (!res.ok) {
    throw new Error(`Failed to load template for ${docType}`);
  }
  return res.text();
}
