import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../context/AuthContext';

// Mock the axios client so no real HTTP calls are made.
jest.mock('../../api/axiosConfig', () => ({
  get: jest.fn(),
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() },
  },
}));

// Mock cookie helpers to avoid cookie state leaking between tests.
jest.mock('../../utils/cookieHelper', () => ({
  setCookie: jest.fn(),
  getCookie: jest.fn().mockReturnValue(null),
  deleteCookie: jest.fn(),
}));

import apiClient from '../../api/axiosConfig';
import { getCookie, setCookie, deleteCookie } from '../../utils/cookieHelper';

// Minimal consumer component for testing the context value.
function AuthConsumer() {
  const { token, user, loading, logout } = useAuth();
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="token">{token ?? 'null'}</span>
      <span data-testid="user">{user ? user.username : 'null'}</span>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

describe('AuthProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    getCookie.mockReturnValue(null);
  });

  it('starts with loading=true and then resolves to loading=false when there is no token', async () => {
    apiClient.get.mockResolvedValue({ data: { user: null } });

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });
  });

  it('fetches user data when a token is present in localStorage', async () => {
    localStorage.setItem('token', 'mock-token-123');
    apiClient.get.mockResolvedValue({ data: { user: { username: 'testuser' } } });

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('testuser');
    });
    expect(screen.getByTestId('loading').textContent).toBe('false');
  });

  it('clears token and user when the API call fails', async () => {
    localStorage.setItem('token', 'bad-token');
    apiClient.get.mockRejectedValue(new Error('Unauthorized'));

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });
    expect(screen.getByTestId('token').textContent).toBe('null');
  });

  it('logout clears token and user', async () => {
    localStorage.setItem('token', 'mock-token-123');
    apiClient.get.mockResolvedValue({ data: { user: { username: 'testuser' } } });

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('testuser');
    });

    act(() => {
      screen.getByRole('button', { name: /logout/i }).click();
    });

    expect(screen.getByTestId('token').textContent).toBe('null');
    expect(screen.getByTestId('user').textContent).toBe('null');
    expect(localStorage.getItem('token')).toBeNull();
    expect(deleteCookie).toHaveBeenCalledWith('loginInfo');
  });
});

describe('useAuth', () => {
  it('throws when used outside of AuthProvider', () => {
    const originalError = console.error;
    console.error = jest.fn(); // suppress React's error boundary output

    function BadConsumer() {
      useAuth();
      return null;
    }

    expect(() => render(<BadConsumer />)).toThrow(
      'useAuth must be used within an AuthProvider'
    );

    console.error = originalError;
  });
});
