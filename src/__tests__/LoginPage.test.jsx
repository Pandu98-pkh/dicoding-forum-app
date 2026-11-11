/**
 * Skenario pengujian LoginPage:
 *
 * 1. Merender form dengan input email, password, dan tombol Login
 * 2. Merender link ke halaman Register
 * 3. Memperbarui nilai input saat user mengetik
 * 4. Mendispatch loginUser dengan email dan password saat form disubmit
 * 5. Menampilkan pesan error ketika state auth.error tidak null
 * 6. Tombol Login menampilkan teks "Logging in..." saat isLoading true
 */

import {
  vi, describe, it, expect, beforeEach,
} from 'vitest';
import { screen, fireEvent, act } from '@testing-library/react';
import * as authService from '../services/authService';
import { renderWithProviders } from '../test/helpers';
import LoginPage from '../pages/LoginPage';

vi.mock('../services/authService');

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authService.login.mockResolvedValue('mock-token');
    authService.getMe.mockResolvedValue({ id: 'u1', name: 'Alice' });
  });

  it('1. merender input email, password, dan tombol Login', () => {
    renderWithProviders(<LoginPage />, { initialEntries: ['/login'] });
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('2. merender link ke halaman Register', () => {
    renderWithProviders(<LoginPage />, { initialEntries: ['/login'] });
    expect(screen.getByRole('link', { name: /register/i })).toBeInTheDocument();
  });

  it('3. memperbarui nilai input saat user mengetik', () => {
    renderWithProviders(<LoginPage />, { initialEntries: ['/login'] });
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('4. mendispatch loginUser saat form disubmit', async () => {
    const { store } = renderWithProviders(<LoginPage />, { initialEntries: ['/login'] });
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
      fireEvent.submit(screen.getByRole('button', { name: /login/i }).closest('form'));
    });

    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('5. menampilkan pesan error dari state auth.error', () => {
    renderWithProviders(<LoginPage />, {
      preloadedState: {
        auth: {
          user: null,
          token: null,
          isLoading: false,
          error: 'email or password is wrong',
        },
      },
      initialEntries: ['/login'],
    });
    expect(screen.getByText('email or password is wrong')).toBeInTheDocument();
  });

  it('6. tombol Login menampilkan "Logging in..." saat isLoading true', () => {
    renderWithProviders(<LoginPage />, {
      preloadedState: {
        auth: {
          user: null,
          token: null,
          isLoading: true,
          error: null,
        },
      },
      initialEntries: ['/login'],
    });
    expect(screen.getByRole('button', { name: /logging in/i })).toBeInTheDocument();
  });
});
