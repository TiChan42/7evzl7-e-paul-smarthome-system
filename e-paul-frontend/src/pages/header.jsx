import React from "react";
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
} from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import SignUpAndInModal from "@/components/signUpAndInModal";
import { env } from "@/utils/env";
import { decryptString, encryptString } from "@/utils/encryptionUtils";
import { useState, useEffect } from "react";
import { useBreakpointValue } from "@chakra-ui/react";

function Header() {
    const [openSignUpAndInModal, setOpenSignUpAndInModal] = useState(false);
    const [signUpAndInModalSite, setSignUpAndInModalSite] = useState(0);
    const isSmallScreen = useBreakpointValue({ base: true, md: false });
    const [accountLoggedIn, setAccountLoggedIn] = useState(
        sessionStorage.getItem("accountID") !== "" &&
        sessionStorage.getItem("accountID") !== null
    );

    useEffect(() => {
        const checkIfAccessAllowed = () => {
            let acceptedPath = env()["non-SignedIn-accessible-Pages"];
            if (!accountLoggedIn && !acceptedPath.includes(window.location.pathname)) {
                window.location.href = "/";
            } else if (accountLoggedIn && 
                (decryptString(sessionStorage.getItem("executingUserID")) === "" || 
                decryptString(sessionStorage.getItem("executingUserID")) === null) && 
                window.location.pathname !== "/chooseuser" && 
                !acceptedPath.includes(window.location.pathname)
            ) {
                window.location.href = "/chooseuser";
            }
        };

        checkIfAccessAllowed();
        window.addEventListener('pageshow', checkIfAccessAllowed);

        return () => {
            window.removeEventListener('pageshow', checkIfAccessAllowed);
        };
    }, [accountLoggedIn]);

    const openSignUpModal = () => {
        setSignUpAndInModalSite(0);
        setOpenSignUpAndInModal(true);
    };

    const openSignInModal = () => {
        setSignUpAndInModalSite(1);
        setOpenSignUpAndInModal(true);
    };

    const signInAccount = () => {
        console.log("Account signed in");
        setAccountLoggedIn(true);
        sessionStorage.setItem("historyLengthBeforeSignIn", encryptString(window.history.length.toString()));
        window.location.href = "/chooseuser";
    };

    const signOutAccount = () => {
        console.log(
            "Account signed out: " +
                decryptString(sessionStorage.getItem("accountID"))
        );
        const data = {
            accountId: decryptString(sessionStorage.getItem("accountID")),
        };
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        };
        fetch(env()["api-path"] + "logout", requestOptions)
            .then((response) => {
                if (response.status === 204) {
                    setAccountLoggedIn(false);
                    sessionStorage.removeItem("accountID");
                    sessionStorage.removeItem("executingUserID");
                    sessionStorage.removeItem("userAuthorized");
                    window.location.href = "/";
                } else {
                    console.log("Error while signing out");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    const signOutUser = () => {
        sessionStorage.removeItem("executingUserID");
        sessionStorage.removeItem("userAuthorized");
        window.location.href = "/chooseuser";
    }

    const signOut = () => {
        if (decryptString(sessionStorage.getItem("executingUserID")) !== "" && decryptString(sessionStorage.getItem("executingUserID")) !== null){
            signOutUser();
        }else{
            signOutAccount();
        }
    }

    const openDashboard = () => {
        console.log(decryptString(sessionStorage.getItem("userAuthorized")));
        if (decryptString(sessionStorage.getItem("userAuthorized")) === "true" && sessionStorage.getItem("executingUserID") !== "" && sessionStorage.getItem("executingUserID") !== null){
            window.location.href = "/devices";
        }else{
            window.location.href = "/chooseuser";
        }
    }

    return (
        <Flex
            bg={"#00697B"}
            alignItems="center"
            verticalAlign="middle"
            position={"sticky"}
            w={"100%"}
            h="70px"
            zIndex={2}
            top={"0px"}
        >
            <Link
                href="/"
                display={"flex"}
                p={[2, 4]}
                alignItems="center"
                _hover={"false"}
            >
                <Image
                    src="assets/img/clearLogoWhite.png"
                    alt="Logo"
                    width="30"
                    height="30"
                    display={"inline-block"}
                    m={"1"}
                />
                <Text
                    color={"whitesmoke"}
                    fontSize={["sm", "md", "xl"]}
                    as={"b"}
                    display={"inline-block"}
                    _hover={{}}
                >
                    {" "}
                    E-Paul
                </Text>
            </Link>
            <Divider orientation="vertical" h={"70%"} borderWidth={1} />
            <Box textAlign={"center"} p={[2, 4]}>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Text
                                as={"b"}
                                fontSize={["sm", "md", "xl"]}
                                color={"white"}
                            >
                                Willkommen
                            </Text>
                        }
                    />
                    <Route
                        path="/about"
                        element={
                            <Text
                                as={"b"}
                                fontSize={["sm", "md", "xl"]}
                                color={"white"}
                            >
                                Über uns
                            </Text>
                        }
                    />
                    <Route
                        path="/chooseuser"
                        element={
                            <Text
                                as={"b"}
                                fontSize={["sm", "md", "xl"]}
                                color={"white"}
                            >
                                Benutzer
                            </Text>
                        }
                    />
                    <Route
                        path="/imprint"
                        element={
                            <Text
                                as={"b"}
                                fontSize={["sm", "md", "xl"]}
                                color={"white"}
                            >
                                Impressum
                            </Text>
                        }
                    />
                    <Route
                        path="/devices"
                        element={
                            <Text
                                as={"b"}
                                fontSize={["sm", "md", "xl"]}
                                color={"white"}
                            >
                                Mein Smart-Home
                            </Text>
                        }
                    />
                    <Route
                        path="/faq"
                        element={
                            <Text
                                as={"b"}
                                fontSize={["sm", "md", "xl"]}
                                color={"white"}
                            >
                                FAQ
                            </Text>
                        }
                    />
                    <Route
                        path="/userSettings"
                        element={
                            <Text
                                as={"b"}
                                fontSize={["sm", "md", "xl"]}
                                color={"white"}
                            >
                                Benutzereinstellungen
                            </Text>
                        }
                    />
                    <Route
                        path="/userAdministration"
                        element={
                            <Text
                                as={"b"}
                                fontSize={["sm", "md", "xl"]}
                                color={"white"}
                            >
                                Benutzerverwaltung
                            </Text>
                        }
                    />
                    <Route
                        path="/settings"
                        element={
                            <Text 
                                as={"b"}
                                fontSize={['md','xl','3xl']} 
                                color={'white'}
                            > 
                                Einstellungen
                            </Text>
                        }
                    />
                </Routes>
            </Box>
            <Spacer />
            <Box
                align={{ base: "center", lg: "end" }}
                justifyContent={{ base: "center", lg: "flex-end" }}
                display="flex"
            >
                {isSmallScreen ? (
                    <Menu>
                        <MenuButton
                            as={Button}
                            colorScheme="teal"
                            variant="solid"
                            fontSize={{ base: "sm", lg: "md" }}
                            padding={{ base: [1, 2], lg: [1, 4] }}
                            mr={{ base: 2, lg: 4 }}
                        >
                            {!accountLoggedIn ? "Zugang" : "Konto"}
                        </MenuButton>
                        <MenuList>
                            {!accountLoggedIn ? (
                                <>
                                    <MenuItem onClick={openSignUpModal}>Registrieren</MenuItem>
                                    <MenuItem onClick={openSignInModal}>Anmelden</MenuItem>
                                </>
                            ) : (
                                <>
                                    <MenuItem onClick={openDashboard}>Dashboard</MenuItem>
                                    <MenuItem onClick={signOut}>Abmelden</MenuItem>
                                </>
                            )}
                        </MenuList>
                    </Menu>
                ) : (
                    <>
                        {!accountLoggedIn ? (
                            <>
                                <Button
                                    colorScheme="teal"
                                    variant="solid"
                                    fontSize={{ base: "sm", lg: "md" }}
                                    padding={{ base: [1, 2], lg: [1, 4] }}
                                    mr={{ base: 2, lg: 4 }}
                                    onClick={openSignUpModal}
                                >
                                    Registrieren
                                </Button>
                                <Button
                                    colorScheme="whiteAlpha"
                                    variant="solid"
                                    fontSize={{ base: "sm", lg: "md" }}
                                    padding={{ base: [1, 2], lg: [1, 4] }}
                                    mr={{ base: 2, lg: 4 }}
                                    onClick={openSignInModal}
                                >
                                    Anmelden
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    colorScheme="teal"
                                    variant="solid"
                                    fontSize={{ base: "sm", lg: "md" }}
                                    padding={{ base: [1, 2], lg: [1, 4] }}
                                    mr={{ base: 2, lg: 4 }}
                                    onClick={openDashboard}
                                >
                                    Dashboard
                                </Button>
                                <Button
                                    colorScheme="whiteAlpha"
                                    variant="solid"
                                    fontSize={{ base: "sm", lg: "md" }}
                                    padding={{ base: [1, 2], lg: [1, 4] }}
                                    mr={{ base: 2, lg: 4 }}
                                    onClick={signOut}
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
            </Box>
        </Flex>
    );
}

export default Header;
