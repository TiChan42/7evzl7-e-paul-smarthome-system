import { Outlet } from 'react-router-dom';
import Header from '@/pages/header';
import Footer from '@/pages/footer';
import { Box, ChakraProvider } from '@chakra-ui/react';
import theme from '@/styles/theme';

export default function RootLayout() {
    return (
        <ChakraProvider theme={theme}>
            <Box bg='gray.50' h='100vh' overflow='hidden'>
                <Header/>
                <Box h='calc(100vh - 120px);' overflowY='auto' bg = {'teal.10'}>
                    <Outlet/>
                </Box>
                <Footer/>
            </Box>
        </ChakraProvider>
    )
}