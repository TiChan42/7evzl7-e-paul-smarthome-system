
/**
 * Komponente für den Header der Seite.
 * 
 * @returns {JSX.Element} Das JSX-Element des Headers.
 * 
 * @requires react
 * @requires @chakra-ui/react
 * @requires react-router-dom
 * @requires ../components/signUpAndInModal
 * @requires ../utils/env
 * @requires ../utils/encryptionUtils
 */
import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Text,
    Image,
    Link,
    Flex,
    Spacer,
    Divider,
    Menu,
    MenuItem,
    MenuList,
    MenuButton,
    useBreakpointValue,
} from '@chakra-ui/react';
import { Route, Routes } from 'react-router-dom';
import SignUpAndInModal from '../components/signUpAndInModal';
import { env } from '../utils/env';
import { decryptString, encryptString } from '../utils/encryptionUtils';

//Header der Seite
function Header() {
    const [openSignUpAndInModal, setOpenSignUpAndInModal] = useState(false);
    const [signUpAndInModalSite, setSignUpAndInModalSite] = useState(0);
    const isSmallScreen = useBreakpointValue({ base: true, md: false });
    const [accountLoggedIn, setAccountLoggedIn] = useState(
        sessionStorage.getItem('accountID') !== '' &&
            sessionStorage.getItem('accountID') !== null
    );

    //Überprüfung ob der Zugriff auf die Seite erlaubt ist
    useEffect(() => {
        const checkIfAccessAllowed = () => {
            let acceptedPath = env()['non-SignedIn-accessible-Pages'];
            if (
                !accountLoggedIn &&
                !acceptedPath.includes(window.location.pathname)
            ) {
                window.location.href = '/';
            } else if (
                accountLoggedIn &&
                (decryptString(sessionStorage.getItem('executingUserID')) ===
                    '' ||
                    decryptString(sessionStorage.getItem('executingUserID')) ===
                        null) &&
                window.location.pathname !== '/chooseuser' &&
                !acceptedPath.includes(window.location.pathname)
            ) {
                window.location.href = '/chooseuser';
            }
        };

        checkIfAccessAllowed();
        window.addEventListener('pageshow', checkIfAccessAllowed);

        return () => {
            window.removeEventListener('pageshow', checkIfAccessAllowed);
        };
    }, [accountLoggedIn]);

    //Funktionen zum Öffnen der Modalen
    const openSignUpModal = () => {
        setSignUpAndInModalSite(0);
        setOpenSignUpAndInModal(true);
    };

    //Funktionen zum Öffnen der Modalen
    const openSignInModal = () => {
        setSignUpAndInModalSite(1);
        setOpenSignUpAndInModal(true);
    };

    //Funktionen zum An- und Abmelden
    const signInAccount = () => {
        setAccountLoggedIn(true);
        sessionStorage.setItem(
            'historyLengthBeforeSignIn',
            encryptString(window.history.length.toString())
        );
        window.location.href = '/chooseuser';
    };

    const signOutAccount = () => {
        console.log(
            'Account signed out: ' +
                decryptString(sessionStorage.getItem('accountID'))
        );
        const data = {
            accountId: decryptString(sessionStorage.getItem('accountID')),
        };
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };
        fetch(env()['api-path'] + 'logout', requestOptions)
            .then((response) => {
                if (response.status === 204) {
                    setAccountLoggedIn(false);
                    sessionStorage.removeItem('accountID');
                    sessionStorage.removeItem('executingUserID');
                    sessionStorage.removeItem('userAuthorized');
                    window.location.href = '/';
                } else {
                    console.log('Error while signing out');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    //Funktionen zum Abmelden des Benutzers
    const signOutUser = () => {
        sessionStorage.removeItem('executingUserID');
        sessionStorage.removeItem('userAuthorized');
        window.location.href = '/chooseuser';
    };

    //Funktionen zum Abmelden des Accounts
    const signOut = () => {
        if (
            decryptString(sessionStorage.getItem('executingUserID')) !== '' &&
            decryptString(sessionStorage.getItem('executingUserID')) !== null
        ) {
            signOutUser();
        } else {
            signOutAccount();
        }
    };

    //Funktion zum Öffnen des Dashboards
    const openDashboard = () => {
        console.log(decryptString(sessionStorage.getItem('userAuthorized')));
        if (
            decryptString(sessionStorage.getItem('userAuthorized')) ===
                'true' &&
            sessionStorage.getItem('executingUserID') !== '' &&
            sessionStorage.getItem('executingUserID') !== null
        ) {
            window.location.href = '/devices';
        } else {
            window.location.href = '/chooseuser';
        }
    };

    return (
        <Flex
            pos={'sticky'}
            zIndex={2}
            top={'0px'}
            align='center'
            verticalAlign='middle'
            w={'100%'}
            h='70px'
            bg={'#00697B'}
        >
            <Link
                alignItems='center'
                display={'flex'}
                p={[2, 4]}
                _hover={{}}
                href='/'
            >
                <Image
                    display={'inline-block'}
                    w='30'
                    h='30'
                    m={'1'}
                    alt='Logo'
                    src='assets/img/clearLogoWhite.png'
                />
                <Text
                    as={'b'}
                    display={'inline-block'}
                    color={'whitesmoke'}
                    fontSize={['sm', 'md', 'xl']}
                    _hover={{}}
                >
                    {' '}
                    E-Paul
                </Text>
            </Link>
            <Divider
                h={'70%'}
                borderWidth={1}
                orientation='vertical'
            />
            <Box
                p={[2, 4]}
                textAlign={'center'}
            >
                <Routes>
                    <Route
                        path='/'
                        element={
                            <Text
                                as={'b'}
                                color={'white'}
                                fontSize={['sm', 'md', 'xl']}
                            >
                                Willkommen
                            </Text>
                        }
                    />
                    <Route
                        path='/about'
                        element={
                            <Text
                                as={'b'}
                                color={'white'}
                                fontSize={['sm', 'md', 'xl']}
                            >
                                Über uns
                            </Text>
                        }
                    />
                    <Route
                        path='/chooseuser'
                        element={
                            <Text
                                as={'b'}
                                color={'white'}
                                fontSize={['sm', 'md', 'xl']}
                            >
                                Benutzer
                            </Text>
                        }
                    />
                    <Route
                        path='/imprint'
                        element={
                            <Text
                                as={'b'}
                                color={'white'}
                                fontSize={['sm', 'md', 'xl']}
                            >
                                Impressum
                            </Text>
                        }
                    />
                    <Route
                        path='/devices'
                        element={
                            <Text
                                as={'b'}
                                color={'white'}
                                fontSize={['sm', 'md', 'xl']}
                            >
                                Mein Smart-Home
                            </Text>
                        }
                    />
                    <Route
                        path='/faq'
                        element={
                            <Text
                                as={'b'}
                                color={'white'}
                                fontSize={['sm', 'md', 'xl']}
                            >
                                FAQ
                            </Text>
                        }
                    />
                    <Route
                        path='/userSettings'
                        element={
                            <Text
                                as={'b'}
                                color={'white'}
                                fontSize={['sm', 'md', 'xl']}
                            >
                                Benutzereinstellungen
                            </Text>
                        }
                    />
                    <Route
                        path='/userAdministration'
                        element={
                            <Text
                                as={'b'}
                                color={'white'}
                                fontSize={['sm', 'md', 'xl']}
                            >
                                Benutzerverwaltung
                            </Text>
                        }
                    />
                    <Route
                        path='/settings'
                        element={
                            <Text
                                as={'b'}
                                color={'white'}
                                fontSize={['md', 'xl', '3xl']}
                            >
                                Einstellungen
                            </Text>
                        }
                    />
                </Routes>
            </Box>
            <Spacer />
            <Flex
                align={{ base: 'center', lg: 'end' }}
                justify={{ base: 'center', lg: 'flex-end' }}
            >
                {isSmallScreen ? (
                    <Menu>
                        <MenuButton
                            as={Button}
                            mr={{ base: 2, lg: 4 }}
                            p={{ base: [1, 2], lg: [1, 4] }}
                            fontSize={{ base: 'sm', lg: 'md' }}
                            colorScheme='teal'
                            variant='solid'
                        >
                            {!accountLoggedIn ? 'Zugang' : 'Konto'}
                        </MenuButton>
                        <MenuList>
                            {!accountLoggedIn ? (
                                <>
                                    <MenuItem onClick={openSignUpModal}>
                                        Registrieren
                                    </MenuItem>
                                    <MenuItem onClick={openSignInModal}>
                                        Anmelden
                                    </MenuItem>
                                </>
                            ) : (
                                <>
                                    <MenuItem onClick={openDashboard}>
                                        Dashboard
                                    </MenuItem>
                                    <MenuItem onClick={signOut}>
                                        Abmelden
                                    </MenuItem>
                                </>
                            )}
                        </MenuList>
                    </Menu>
                ) : (
                    <>
                        {!accountLoggedIn ? (
                            <>
                                <Button
                                    mr={{ base: 2, lg: 4 }}
                                    p={{ base: [1, 2], lg: [1, 4] }}
                                    fontSize={{ base: 'sm', lg: 'md' }}
                                    colorScheme='teal'
                                    onClick={openSignUpModal}
                                    variant='solid'
                                >
                                    Registrieren
                                </Button>
                                <Button
                                    mr={{ base: 2, lg: 4 }}
                                    p={{ base: [1, 2], lg: [1, 4] }}
                                    fontSize={{ base: 'sm', lg: 'md' }}
                                    colorScheme='whiteAlpha'
                                    onClick={openSignInModal}
                                    variant='solid'
                                >
                                    Anmelden
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    mr={{ base: 2, lg: 4 }}
                                    p={{ base: [1, 2], lg: [1, 4] }}
                                    fontSize={{ base: 'sm', lg: 'md' }}
                                    colorScheme='teal'
                                    onClick={openDashboard}
                                    variant='solid'
                                >
                                    Dashboard
                                </Button>
                                <Button
                                    mr={{ base: 2, lg: 4 }}
                                    p={{ base: [1, 2], lg: [1, 4] }}
                                    fontSize={{ base: 'sm', lg: 'md' }}
                                    colorScheme='whiteAlpha'
                                    onClick={signOut}
                                    variant='solid'
                                >
                                    Abmelden
                                </Button>
                            </>
                        )}
                    </>
                )}
                <SignUpAndInModal
                    openModal={openSignUpAndInModal}
                    closeModal={() => setOpenSignUpAndInModal(false)}
                    entrySite={signUpAndInModalSite}
                    onSignIn={signInAccount}
                    onSignUp={() => {}}
                />
            </Flex>
        </Flex>
    );
}

export default Header;
