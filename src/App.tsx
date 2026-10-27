const BUILD_TAG = "mz-4073";
import { lazy, Suspense } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import LibraryPage from './features/library/LibraryPage';
import PlayerBar from './features/player/PlayerBar';
import { useTheme } from './contexts/ThemeContext';

const FavoritesPage = lazy(() => import('./features/favorites/FavoritesPage'));
const PlaylistsPage = lazy(() => import('./features/playlists/PlaylistsPage'));
const PlaylistDetailPage = lazy(() => import('./features/playlists/PlaylistDetailPage'));

export function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="app-container" data-build-tag={BUILD_TAG}>
      <header className="navbar">
        <div className="nav-brand">Trình phát nhạc mini</div>
        <nav className="nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            Thư viện
          </NavLink>
          <NavLink
            to="/favorites"
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            Yêu thích
          </NavLink>
          <NavLink
            to="/playlists"
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            Playlist
          </NavLink>
          <button
            type="button"
            className="btn-theme-toggle"
            onClick={toggleTheme}
            aria-label="Đổi giao diện"
          >
            {theme === 'dark' ? 'Giao diện sáng' : 'Giao diện tối'}
          </button>
        </nav>
      </header>

      <main className="main-content">
        <Suspense fallback={<p>Đang tải trang...</p>}>
          <Routes>
            <Route path="/" element={<LibraryPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/playlists" element={<PlaylistsPage />} />
            <Route path="/playlists/:id" element={<PlaylistDetailPage />} />
          </Routes>
        </Suspense>
      </main>

      <PlayerBar />
    </div>
  );
}

export default App;
