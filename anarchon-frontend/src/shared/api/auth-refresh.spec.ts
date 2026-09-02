import { describe, it, expect, vi, beforeEach } from 'vitest';
import { refreshAccessToken } from './auth-refresh';
import { useAuthStore } from '@/features/auth/auth.store';

describe('refreshAccessToken', () => {
  beforeEach(() => {
    useAuthStore.getState().clearSession();
    vi.restoreAllMocks();
  });

  it('shares a single in-flight request across concurrent callers', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ access_token: 'new-token' }), {
        status: 201,
      }),
    );

    const [first, second] = await Promise.all([
      refreshAccessToken(),
      refreshAccessToken(),
    ]);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(first).toBe('new-token');
    expect(second).toBe('new-token');
    expect(useAuthStore.getState().accessToken).toBe('new-token');
  });

  it('allows a new refresh once the previous one has settled', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ access_token: 'token-1' }), {
          status: 201,
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ access_token: 'token-2' }), {
          status: 201,
        }),
      );

    await refreshAccessToken();
    await refreshAccessToken();

    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it('clears the session and rejects when the refresh fails', async () => {
    useAuthStore.getState().setSession({
      accessToken: 'stale-token',
      user: { id: '1', email: 'a@a.com', name: 'Ada', gender: 'FEMME' },
    });
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, { status: 401 }),
    );

    await expect(refreshAccessToken()).rejects.toThrow();
    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(useAuthStore.getState().user).toBeNull();
  });
});
