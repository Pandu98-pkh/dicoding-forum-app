/**
 * Skenario pengujian VoteButton:
 *
 * 1. Menampilkan jumlah upvote dan downvote dengan benar
 * 2. Menampilkan voteCount (upvotes - downvotes) di tengah
 * 3. Memanggil onVote('up') saat tombol upvote diklik (belum vote)
 * 4. Memanggil onVote('neutral') saat tombol upvote diklik oleh user yang sudah upvote (toggle off)
 * 5. Memanggil onVote('down') saat tombol downvote diklik
 * 6. Tidak memanggil onVote saat user belum login (currentUserId null)
 * 7. Menampilkan state aktif (highlight) ketika user sudah upvote
 */

import {
  vi, describe, it, expect,
} from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import VoteButton from '../components/vote/VoteButton';

const defaultProps = {
  upVotesBy: [],
  downVotesBy: [],
  onVote: vi.fn(),
  currentUserId: null,
};

describe('VoteButton', () => {
  it('1. menampilkan jumlah upvote dan downvote dengan benar', () => {
    render(
      <VoteButton
        upVotesBy={['user-1', 'user-2']}
        downVotesBy={['user-3']}
        onVote={vi.fn()}
        currentUserId={null}
      />,
    );
    const [upvoteBtn, downvoteBtn] = screen.getAllByRole('button');
    expect(upvoteBtn).toHaveTextContent('2');
    expect(downvoteBtn).toHaveTextContent('1');
  });

  it('2. menampilkan voteCount (upvotes - downvotes) yang benar', () => {
    render(
      <VoteButton
        upVotesBy={['u1', 'u2', 'u3']}
        downVotesBy={['u4']}
        onVote={vi.fn()}
        currentUserId={null}
      />,
    );
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('3. memanggil onVote("up") saat tombol upvote diklik oleh user yang belum vote', () => {
    const onVote = vi.fn();
    render(
      <VoteButton
        upVotesBy={[]}
        downVotesBy={[]}
        onVote={onVote}
        currentUserId="user-current"
      />,
    );
    fireEvent.click(screen.getByTitle('Upvote'));
    expect(onVote).toHaveBeenCalledWith('up');
  });

  it('4. memanggil onVote("neutral") saat upvote diklik lagi oleh user yang sudah upvote', () => {
    const onVote = vi.fn();
    render(
      <VoteButton
        upVotesBy={['user-current']}
        downVotesBy={[]}
        onVote={onVote}
        currentUserId="user-current"
      />,
    );
    fireEvent.click(screen.getByTitle('Upvote'));
    expect(onVote).toHaveBeenCalledWith('neutral');
  });

  it('5. memanggil onVote("down") saat tombol downvote diklik', () => {
    const onVote = vi.fn();
    render(
      <VoteButton
        upVotesBy={[]}
        downVotesBy={[]}
        onVote={onVote}
        currentUserId="user-current"
      />,
    );
    fireEvent.click(screen.getByTitle('Downvote'));
    expect(onVote).toHaveBeenCalledWith('down');
  });

  it('6. tidak memanggil onVote saat currentUserId null (user belum login)', () => {
    const onVote = vi.fn();
    render(
      <VoteButton
        {...defaultProps}
        onVote={onVote}
        currentUserId={null}
      />,
    );
    fireEvent.click(screen.getAllByTitle('Login to vote')[0]);
    expect(onVote).not.toHaveBeenCalled();
  });

  it('7. tombol upvote menampilkan title "Login to vote" saat user belum login', () => {
    render(<VoteButton {...defaultProps} currentUserId={null} />);
    const buttons = screen.getAllByTitle('Login to vote');
    expect(buttons).toHaveLength(2);
  });
});
