import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { PlaylistProvider } from './PlaylistContext';
import { PlaylistsPage } from './PlaylistsPage';
import type { Playlist } from './playlistReducer';

function renderWithProviders(
  ui: React.ReactElement,
  options?: { initialPlaylists?: Playlist[] }
) {
  return {
    user: userEvent.setup(),
    ...render(
      <MemoryRouter>
        <PlaylistProvider initialPlaylists={options?.initialPlaylists ?? []}>
          {ui}
        </PlaylistProvider>
      </MemoryRouter>
    ),
  };
}

describe('PlaylistsPage component', () => {
  it('bấm Tạo khi ô trống thì thấy "Tên playlist không được để trống"', async () => {
    const { user } = renderWithProviders(<PlaylistsPage />);

    const createButton = screen.getByRole('button', { name: 'Tạo' });
    await user.click(createButton);

    expect(screen.getByText('Tên playlist không được để trống')).toBeInTheDocument();
  });

  it('nhập tên rồi bấm Tạo thì tên xuất hiện trong danh sách', async () => {
    const { user } = renderWithProviders(<PlaylistsPage />);

    const input = screen.getByLabelText('Tên playlist');
    const createButton = screen.getByRole('button', { name: 'Tạo' });

    await user.type(input, 'Chạy bộ');
    await user.click(createButton);

    expect(await screen.findByText('Chạy bộ')).toBeInTheDocument();
  });

  it('báo lỗi khi tạo playlist trùng tên (không phân biệt hoa thường)', async () => {
    const { user } = renderWithProviders(<PlaylistsPage />, {
      initialPlaylists: [{ id: 'pl-1', name: 'Chạy bộ', songIds: [] }],
    });

    const input = screen.getByLabelText('Tên playlist');
    const createButton = screen.getByRole('button', { name: 'Tạo' });

    await user.type(input, 'chạy bộ');
    await user.click(createButton);

    expect(screen.getByText('Tên playlist đã tồn tại')).toBeInTheDocument();
  });
});
