import React, { Component } from 'react';
import { Box, Flex, Button, Spacer, Text, Image, Link } from '@chakra-ui/react';
import { Route, Routes } from 'react-router-dom';
import './header.css'

class Header extends Component {
    state = {  } 
    render() { 
        return (
            <>
                <Box bg={"#218395"} alignItems="center" position={'sticky'} w={"100%"} zIndex={2} top={"0px"}>
                    <Flex>
                        <Link href="/" display={"flex"} p={"3"} alignItems="center">
                            <Image src="assets/img/clearLogoWhite.png" alt="Logo" width="30" height="30" display={'inline-block'} m={"1"}/>
                            <Text color={"whitesmoke"} fontSize={"xl"} as={"b"} display={'inline-block'} _hover={{}}> E-Paul</Text>
                        </Link>
                        <Spacer/>

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
                                path="/signIn"
                                element={<Text as={"b"} fontSize='3xl' color={'white'}>Registrieren</Text>}
                            />
                            <Route
                                path="/login"
                                element={<Text as={"b"} fontSize='3xl' color={'white'}>Anmelden</Text>}
                            />
                            </Routes>

                        <Spacer/>
                        <Box p={"3"} mr={3}>
                            <Link href="/signin">
                                <Button colorScheme='teal' variant='solid' mr={"3"} >
                                    Sign up
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button colorScheme='whiteAlpha' variant='solid'>
                                    Log in
                                </Button>
                            </Link>
                        </Box>
                    </Flex>
                </Box>
            </>
        );
    };
}
 
export default Header;
