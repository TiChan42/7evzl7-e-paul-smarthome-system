import React, { Component } from 'react';
import { Box, Grid, Button, Text, Image, Link, GridItem } from '@chakra-ui/react';
import { Route, Routes } from 'react-router-dom';

class Header extends Component {
    state = {  } 
    render() { 
        return (
            <Grid templateColumns={{base: 'repeat(2, 1fr)',lg:'repeat(3, 1fr)'}} bg={"#218395"} alignItems="center" position={'sticky'} w={"100%"} h={"64px"} zIndex={2} top={"0px"} borderBottom={"1px"} borderBottomColor={"#f8fafc"}>
                <GridItem>
                <Link href="/" display={"flex"} p={4} alignItems="center" _hover={"false"}>
                    <Image src="assets/img/clearLogoWhite.png" alt="Logo" width="30" height="30" display={'inline-block'} m={"1"}/>
                    <Text color={"whitesmoke"} fontSize={"xl"} as={"b"} display={'inline-block'} _hover={{}}> E-Paul</Text>
                </Link>
                </GridItem>
                
                <GridItem display={{base:'none',lg:'inherit' }}>
                <Box textAlign={'center'}>
                    <Routes>
                        <Route
                            path="/"
                            element={<Text as={"b"} fontSize='3xl' color={'white'}>Willkommen</Text>}
                        />
                        <Route
                            path="/about"
                            element={<Text as={"b"} fontSize='3xl' color={'white'}>Über uns</Text>}
                        />
                        <Route
                            path="/chooseuser"
                            element={<Text as={"b"} fontSize='3xl' color={'white'}>Benutzerauswahl</Text>}
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
                            path="/userSettings"
                            element={<Text as={"b"} fontSize='3xl' color={'white'}>Benutzereinstellungen</Text>}
                        />
                        <Route
                            path="/userAdministration"
                            element={<Text as={"b"} fontSize='3xl' color={'white'}>Benutzerverwaltung</Text>}
                        />
                        </Routes>
                        
                    </Box>
                </GridItem>

                <GridItem>
                    <Box align='end'>
                    <Link href="/register" _hover={false} pr={4}>
                        <Button colorScheme='teal' variant='solid'>
                            Registrieren
                        </Button>
                    </Link>
                    <Link href="/login" _hover={false} pr={4}>
                        <Button colorScheme='whiteAlpha' variant='solid'>
                            Anmelden
                        </Button>
                    </Link>
                    </Box>
                </GridItem>
            </Grid>
        );
    };
}
 
export default Header;
