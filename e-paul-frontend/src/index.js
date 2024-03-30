
/**
 * Render the React application.
 *
 * @requires React
 * @requires @chakra-ui/react
 * @requires react-dom/client
 * @requires ./App
 * @requires ./styles/theme
 *
 * @param {HTMLElement} rootElement - The root element to render the application into.
 * @return {void}
 */
import React, { StrictMode } from 'react';
import { ColorModeScript } from '@chakra-ui/react';
import ReactDom from 'react-dom/client';
import App from './App';
import theme from './styles/theme';

const rootElement = document.getElementById('root');
ReactDom.createRoot(rootElement).render(
    <>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <StrictMode>
            <App />
        </StrictMode>
    </>
);
