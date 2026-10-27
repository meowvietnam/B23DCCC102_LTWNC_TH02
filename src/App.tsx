const BUILD_TAG = "mz-4073";
import { Routes, Route, NavLink } from 'react-router-dom';
import LibraryPage from './features/library/LibraryPage';
import FavoritesPage from './features/favorites/FavoritesPage';
import PlaylistsPage from './features/playlists/PlaylistsPage';
import PlaylistDetailPage from './features/playlists/PlaylistDetailPage';
import PlayerBar from './features/player/PlayerBar';

export function App() {
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
        </nav>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<LibraryPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/playlists" element={<PlaylistsPage />} />
          <Route path="/playlists/:id" element={<PlaylistDetailPage />} />
        </Routes>
      </main>

      <PlayerBar />
    </div>
  );
}

export default App;
