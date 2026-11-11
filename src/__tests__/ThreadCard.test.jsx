/**
 * Skenario pengujian ThreadCard:
 *
 * 1. Merender judul thread dengan link ke halaman detail
 * 2. Menampilkan badge kategori jika ada
 * 3. Menampilkan nama pemilik thread
 * 4. Menampilkan total komentar
 * 5. Memanggil dispatch voteThread saat vote diklik oleh user yang login
 */

import {
  vi, describe, it, expect,
} from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../test/helpers';
import ThreadCard from '../components/thread/ThreadCard';

vi.mock('../services/threadService');

const mockThread = {
  id: 'thread-1',
  title: 'Diskusi React Testing',
  body: 'Bagaimana cara menulis test yang baik untuk React?',
  category: 'react',
  createdAt: '2024-01-15T08:00:00Z',
  totalComments: 5,
  upVotesBy: ['user-2'],
  downVotesBy: [],
  owner: {
    id: 'user-1',
    name: 'Alice Dev',
    avatar: '',
  },
};

describe('ThreadCard', () => {
  it('1. merender judul thread sebagai link ke halaman detail', () => {
    renderWithProviders(<ThreadCard thread={mockThread} />);
    const titleLink = screen.getByRole('link', { name: /diskusi react testing/i });
    expect(titleLink).toBeInTheDocument();
    expect(titleLink).toHaveAttribute('href', '/threads/thread-1');
  });

  it('2. menampilkan badge kategori jika ada', () => {
    renderWithProviders(<ThreadCard thread={mockThread} />);
    expect(screen.getByText('#react')).toBeInTheDocument();
  });

  it('3. menampilkan nama pemilik thread', () => {
    renderWithProviders(<ThreadCard thread={mockThread} />);
    expect(screen.getByText('Alice Dev')).toBeInTheDocument();
  });

  it('4. menampilkan jumlah total komentar', () => {
    renderWithProviders(<ThreadCard thread={mockThread} />);
    expect(screen.getByText(/5\s+comments/i)).toBeInTheDocument();
  });

  it('5. memanggil dispatch voteThread saat upvote diklik oleh user yang login', () => {
    const { store } = renderWithProviders(<ThreadCard thread={mockThread} />, {
      preloadedState: {
        auth: {
          user: { id: 'user-current', name: 'Current User' },
          token: 'test-token',
          isLoading: false,
          error: null,
        },
        threads: {
          items: [mockThread],
          isLoading: false,
          error: null,
          selectedCategory: '',
        },
      },
    });

    fireEvent.click(screen.getByTitle('Upvote'));
    // voteThread.pending fires optimistic update synchronously
    const updatedThread = store.getState().threads.items.find((t) => t.id === 'thread-1');
    expect(updatedThread.upVotesBy).toContain('user-current');
  });
});
