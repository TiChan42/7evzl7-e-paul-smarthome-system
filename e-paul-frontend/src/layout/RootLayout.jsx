import { Outlet } from 'react-router-dom';
import Header from '../pages/header';
import Footer from '../pages/footer';
import { Box, ChakraProvider } from '@chakra-ui/react';
import theme from '../styles/theme';

export default function RootLayout() {
    return (
        <ChakraProvider theme={theme}>
            <Box
                overflow='hidden'
                h='100vh'
                bg='gray.50'
            >
                <Header />
                <Box
                    overflowY='auto'
                    h='calc(100vh - 120px);'
                    bg={'teal.30'}
                >
                    <Outlet />
                </Box>
                <Footer />
            </Box>
        </ChakraProvider>
    );
}
