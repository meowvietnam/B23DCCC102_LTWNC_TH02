const BUILD_TAG = "mz-4073";
import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import LibraryPage from './features/library/LibraryPage';
import PlayerBar from './features/player/PlayerBar';
import { useTheme } from './contexts/ThemeContext';
import { usePlayerStore } from './features/player/usePlayerStore';

const FavoritesPage = lazy(() => import('./features/favorites/FavoritesPage'));
const PlaylistsPage = lazy(() => import('./features/playlists/PlaylistsPage'));
const PlaylistDetailPage = lazy(() => import('./features/playlists/PlaylistDetailPage'));

export function App() {
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        const target = e.target as HTMLElement | null;
        if (
          target &&
          (target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.tagName === 'SELECT' ||
            target.isContentEditable)
        ) {
          return;
        }
        e.preventDefault();
        usePlayerStore.getState().togglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
