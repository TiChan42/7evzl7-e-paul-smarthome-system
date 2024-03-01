import { Outlet } from 'react-router-dom';
import Header from '../components/pages/header';
import Footer from '../components/pages/footer';
import { Box, ChakraProvider, calc } from '@chakra-ui/react';
import { calcLength } from 'framer-motion';
import theme from '../theme';

export default function RootLayout() {
    return (
        <ChakraProvider theme={theme}>
            <Box bg='gray.50' h='100vh' overflow='hidden'>
                <Header/>
                <Box h='calc(100vh - 14vh);' overflowY='auto'>
                    <Outlet/>
                </Box>
                <Footer/>
            </Box>
        </ChakraProvider>
    )
}