import { http } from '@/shared/api/http';
import type { Profile } from './auth.store';
import type { LoginInput, RegisterInput } from './auth.schemas';

interface TokenResponse {
  access_token: string;
}

export function register(input: RegisterInput): Promise<TokenResponse> {
  return http.post<TokenResponse>('/auth/register', input);
}

export function login(input: LoginInput): Promise<TokenResponse> {
  return http.post<TokenResponse>('/auth/login', input);
}

export function logout(): Promise<{ success: boolean }> {
  return http.post<{ success: boolean }>('/auth/logout');
}

export function fetchProfile(): Promise<Profile> {
  return http.get<Profile>('/auth/me');
}
