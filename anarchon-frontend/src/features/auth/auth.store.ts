import { create } from 'zustand';
import type { Gender } from './auth.schemas';

export interface Profile {
  id: string;
  email: string;
  name: string;
  gender: Gender;
}

interface AuthState {
  accessToken: string | null;
  user: Profile | null;
  setSession: (session: { accessToken: string; user: Profile }) => void;
  setAccessToken: (accessToken: string) => void;
  clearSession: () => void;
}

// Deliberately not persisted (no `persist` middleware): the access token
// lives in memory only. Session continuity across a page reload comes from
// the httpOnly refresh cookie via bootstrap-auth.ts, never from localStorage.
export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  setSession: ({ accessToken, user }) => set({ accessToken, user }),
  setAccessToken: (accessToken) => set({ accessToken }),
  clearSession: () => set({ accessToken: null, user: null }),
}));
