import { Outlet } from "react-router-dom";
import Header from "../components/pages/header";
import Footer from "../components/pages/footer";
import { Box, ChakraProvider } from "@chakra-ui/react";
import theme from "../styles/theme";

export default function RootLayout() {
    return (
        <ChakraProvider theme={theme}>
            <Box bg='gray.50'>
                <Header/>
                <Box minHeight="88vh">
                    <Outlet/>
                </Box>
                <Footer/>
            </Box>
        </ChakraProvider>
    )
}