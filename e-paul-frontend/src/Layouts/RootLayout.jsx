import { Outlet } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import { Box, ChakraProvider } from "@chakra-ui/react";
export default function RootLayout() {
    return (
        <ChakraProvider>
            <Header/>
            <Box mt={14}>
                <Outlet/>
            </Box>
            <Footer/>
        </ChakraProvider>
    )
}