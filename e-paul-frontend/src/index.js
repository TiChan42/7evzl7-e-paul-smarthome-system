import React from "react"
import { ColorModeScript } from '@chakra-ui/react'
import ReactDom from "react-dom/client"
import App from "./App";
import theme from '@/styles/theme.js'

const rootElement = document.getElementById('root')
ReactDom.createRoot(rootElement).render(
    <>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <App />
    </>
)