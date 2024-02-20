import React, { Component } from 'react';
import { Box, Grid, Button, Text, Image, Link, GridItem } from '@chakra-ui/react';
import { Route, Routes } from 'react-router-dom';
import './header.css'

class Header extends Component {
    state = {  } 
    render() { 
        return (
            <Grid templateColumns='repeat(3, 1fr)' bg={"#218395"} alignItems="center" position={'sticky'} w={"100%"} h={"8vh"} zIndex={2} top={"0px"}>
                <GridItem>
                <Link href="/" display={"flex"} p={4} alignItems="center" _hover={"false"}>
                    <Image src="assets/img/clearLogoWhite.png" alt="Logo" width="30" height="30" display={'inline-block'} m={"1"}/>
                    <Text color={"whitesmoke"} fontSize={"xl"} as={"b"} display={'inline-block'} _hover={{}}> E-Paul</Text>
                </Link>
                </GridItem>
                
                <GridItem>
                <Box textAlign={'center'}>
                    <Routes>
                        <Route
                            path="/"
                            element={<Text as={"b"} fontSize='3xl' color={'white'}>Welcome</Text>}
                        />
                        <Route
                            path="/about"
                            element={<Text as={"b"} fontSize='3xl' color={'white'}>About</Text>}
                        />
                        <Route
                            path="/chooseuser"
                            element={<Text as={"b"} fontSize='3xl' color={'white'}>User</Text>}
                        />
                        <Route
                            path="/signIn"
                            element={<Text as={"b"} fontSize='3xl' color={'white'}>Registrieren</Text>}
                        />
                        <Route
                            path="/login"
                            element={<Text as={"b"} fontSize='3xl' color={'white'}>Anmelden</Text>}
                        />
                        <Route
                            path="/impressum"
                            element={<Text as={"b"} fontSize='3xl' color={'white'}>Impressum</Text>}
                        />
                        <Route
                            path="/devices"
                            element={<Text as={"b"} fontSize='3xl' color={'white'}>Geräteübersicht</Text>}
                        />
                        <Route
                            path="/faq"
                            element={<Text as={"b"} fontSize='3xl' color={'white'}>FAQ</Text>}
                        />
                        </Routes>
                        
                    </Box>
                </GridItem>

                <GridItem>
                    <Box align='end'>
                    <Link href="/signin" _hover={false} pr={4}>
                        <Button colorScheme='teal' variant='solid'>
                            Sign up
                        </Button>
                    </Link>
                    <Link href="/login" _hover={false} pr={4}>
                        <Button colorScheme='whiteAlpha' variant='solid'>
                            Log in
                        </Button>
                    </Link>
                    </Box>
                </GridItem>
            </Grid>
        );
    };
}
 
export default Header;
