import { Outlet } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import { Box, ChakraProvider } from "@chakra-ui/react";
export default function RootLayout() {
    return (
        <ChakraProvider>
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