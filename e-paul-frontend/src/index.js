import React from "react"
import ReactDom from "react-dom"
import App from "./App";
import theme from "./styles/theme";
import { ColorModeScript } from "@chakra-ui/react";

const rootElement = document.getElementById('root')
ReactDom.createRoot(rootElement).render(
    <>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <App />
    </>
)