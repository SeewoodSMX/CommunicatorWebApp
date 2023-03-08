import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import { router } from './App';
import { ThemeProvider } from '@emotion/react';
import { theme } from './components/homePage/Theme.jsx';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
//strictMode tylko podczas developmentu, potem usunąć
root.render(
    <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
    </ThemeProvider>
);
