import React, { Component } from 'react';
import { Box, Grid, Button, Text, Image, Link, GridItem } from '@chakra-ui/react';
import { Route, Routes } from 'react-router-dom';

class Header extends Component {
    state = {  } 
    render() { 
        return (
            <Grid templateColumns='repeat(3, 1fr)' bg={"#00697B"} alignItems="center" verticalAlign="middle" position={'sticky'} w={"100%"} h="8vh" minH="50px" zIndex={2} top={"0px"}>
                <GridItem>
                    <Link href="/" display={"flex"} p={[1, 2 , 4]} alignItems="center" _hover={"false"}>
                        <Image src="assets/img/clearLogoWhite.png" alt="Logo" width="30" height="30" display={'inline-block'} m={"1"}/>
                        <Text color={"whitesmoke"} fontSize={["sm","md", "xl"]} as={"b"} display={'inline-block'} _hover={{}}> E-Paul</Text>
                    </Link>
                </GridItem>
                
                <GridItem>
                <Box textAlign={'center'}>
                    <Routes>
                        <Route
                            path="/"
                            element={<Text as={"b"} fontSize={['md','xl','3xl']} color={'white'}>Welcome</Text>}
                        />
                        <Route
                            path="/about"
                            element={<Text as={"b"} fontSize={['md','xl','3xl']} color={'white'}>About</Text>}
                        />
                        <Route
                            path="/chooseuser"
                            element={<Text as={"b"} fontSize={['md','xl','3xl']} color={'white'}>User</Text>}
                        />
                        <Route
                            path="/register"
                            element={<Text as={"b"} fontSize={['md','xl','3xl']} color={'white'}>Registrieren</Text>}
                        />
                        <Route
                            path="/login"
                            element={<Text as={"b"} fontSize={['md','xl','3xl']} color={'white'}>Anmelden</Text>}
                        />
                        <Route
                            path="/impressum"
                            element={<Text as={"b"} fontSize={['md','xl','3xl']} color={'white'}>Impressum</Text>}
                        />
                        <Route
                            path="/devices"
                            element={<Text as={"b"} fontSize={['md','xl','3xl']} color={'white'}>Geräteübersicht</Text>}
                        />
                        <Route
                            path="/faq"
                            element={<Text as={"b"} fontSize={['md','xl','3xl']} color={'white'}>FAQ</Text>}
                        />
                        <Route
                            path="/userSettings"
                            element={<Text as={"b"} fontSize={['md','xl','3xl']} color={'white'}>Benutzereinstellungen</Text>}
                        />
                        <Route
                            path="/userAdministration"
                            element={<Text as={"b"} fontSize={['md','xl','3xl']} color={'white'}>Benutzerverwaltung</Text>}
                        />
                        </Routes>
                        
                    </Box>
                </GridItem>

                <GridItem>
                    <Box align='end'>
                    <Link href="/register" _hover={false} pr={[1, 2, 4]}>
                        <Button colorScheme='teal' variant='solid' fontSize={[12, 12, 16]} padding={[1, 4]}>
                            Sign up
                        </Button>
                    </Link>
                    <Link href="/login" _hover={false} pr={[1, 2, 4]}>
                        <Button colorScheme='whiteAlpha' variant='solid' fontSize={[12, 12, 16]} padding={[1, 4]}>
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
