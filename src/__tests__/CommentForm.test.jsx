/**
 * Skenario pengujian CommentForm:
 *
 * 1. Menampilkan pesan login saat isLoggedIn false
 * 2. Menampilkan form komentar saat isLoggedIn true
 * 3. Tombol "Post Comment" disabled saat textarea kosong
 * 4. Memanggil onSubmit dengan konten komentar yang diisi
 * 5. Mengosongkan textarea setelah submit berhasil
 * 6. Menampilkan teks "Posting..." pada tombol saat isLoading true
 */

import {
  vi, describe, it, expect,
} from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CommentForm from '../components/comment/CommentForm';

const renderCommentForm = (props) => render(
  <MemoryRouter>
    <CommentForm {...props} />
  </MemoryRouter>,
);

describe('CommentForm', () => {
  it('1. menampilkan pesan login beserta link saat isLoggedIn false', () => {
    renderCommentForm({ onSubmit: vi.fn(), isLoading: false, isLoggedIn: false });
    expect(screen.getByText(/to leave a comment/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
  });

  it('2. menampilkan form textarea dan tombol saat isLoggedIn true', () => {
    renderCommentForm({ onSubmit: vi.fn(), isLoading: false, isLoggedIn: true });
    expect(screen.getByPlaceholderText(/write your comment/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /post comment/i })).toBeInTheDocument();
  });

  it('3. tombol disabled saat textarea kosong', () => {
    renderCommentForm({ onSubmit: vi.fn(), isLoading: false, isLoggedIn: true });
    expect(screen.getByRole('button', { name: /post comment/i })).toBeDisabled();
  });

  it('4. memanggil onSubmit dengan konten komentar saat disubmit', () => {
    const onSubmit = vi.fn();
    renderCommentForm({ onSubmit, isLoading: false, isLoggedIn: true });

    const textarea = screen.getByPlaceholderText(/write your comment/i);
    fireEvent.change(textarea, { target: { value: 'Ini komentar saya' } });
    fireEvent.click(screen.getByRole('button', { name: /post comment/i }));

    expect(onSubmit).toHaveBeenCalledWith('Ini komentar saya');
  });

  it('5. textarea dikosongkan setelah submit', () => {
    const onSubmit = vi.fn();
    renderCommentForm({ onSubmit, isLoading: false, isLoggedIn: true });

    const textarea = screen.getByPlaceholderText(/write your comment/i);
    fireEvent.change(textarea, { target: { value: 'Komentar' } });
    fireEvent.click(screen.getByRole('button', { name: /post comment/i }));

    expect(textarea.value).toBe('');
  });

  it('6. menampilkan teks "Posting..." pada tombol saat isLoading true', () => {
    renderCommentForm({ onSubmit: vi.fn(), isLoading: true, isLoggedIn: true });
    expect(screen.getByRole('button', { name: /posting/i })).toBeInTheDocument();
  });
});
