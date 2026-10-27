import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { PlaylistProvider } from './features/playlists/PlaylistContext';
import { ThemeProvider } from './contexts/ThemeContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <PlaylistProvider>
          <App />
        </PlaylistProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
