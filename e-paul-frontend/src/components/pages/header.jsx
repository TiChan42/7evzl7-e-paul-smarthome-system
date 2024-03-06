import React, { Component } from "react";
import {
    Box,
    Button,
    Text,
    Image,
    Link,
    Flex,
    Spacer,
    Divider,
} from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import SignUpAndInModal from "../signUpAndInModal";
import { env } from "../../env";
import { decryptString } from "../../encryptionUtils";

class Header extends Component {
    state = {
        openSignUpAndInModal: false,
        signUpAndInModalSite: 0,
        accountLoggedIn:
            sessionStorage.getItem("accountID") !== "" &&
            sessionStorage.getItem("accountID") !== null,
    };
    openSignUpAndInModal = () => {
        this.setState({ openSignUpAndInModal: true });
    };
    closeSignUpAndInModal = () => {
        this.setState({ openSignUpAndInModal: false });
    };
    setSignUpAndInModalSiteToSignUp = () => {
        this.setState({ signUpAndInModalSite: 0 });
    };
    setSignUpAndInModalSiteToSignIn = () => {
        this.setState({ signUpAndInModalSite: 1 });
    };

    openSignUpModal = () => {
        this.setSignUpAndInModalSiteToSignUp();
        this.openSignUpAndInModal();
    };

    openSignInModal = () => {
        this.setSignUpAndInModalSiteToSignIn();
        this.openSignUpAndInModal();
    };

    signInAccount = () => {
        console.log("Account signed in");
        this.setState({ accountLoggedIn: true });
        window.location.href = "/chooseuser";
    };

    signOutAccount = () => {
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
                    this.setState({ accountLoggedIn: false });

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

    testStillLoggedIn = () => {
        if (!this.state.accountLoggedIn) {
            console.log("Account signed out");
            window.location.href = "/";
        }
    };

    render() {
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
                                    Geräteübersicht
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
                    </Routes>
                </Box>
                <Spacer />
                <Box
                    align={{ base: "center", lg: "end" }}
                    justifyContent={{ base: "center", lg: "flex-end" }}
                    display="flex"
                >
                    {!this.state.accountLoggedIn ? (
                        <>
                            <Button
                                colorScheme="teal"
                                variant="solid"
                                fontSize={{ base: "sm", lg: "md" }}
                                padding={{ base: [1, 2], lg: [1, 4] }}
                                mr={{ base: 2, lg: 4 }}
                                onClick={this.openSignUpModal}
                            >
                                Registrieren
                            </Button>
                            <Button
                                colorScheme="whiteAlpha"
                                variant="solid"
                                fontSize={{ base: "sm", lg: "md" }}
                                padding={{ base: [1, 2], lg: [1, 4] }}
                                mr={{ base: 2, lg: 4 }}
                                onClick={this.openSignInModal}
                            >
                                Anmelden
                            </Button>
                        </>
                    ) : (
                        <Button
                            colorScheme="teal"
                            variant="solid"
                            fontSize={{ base: "sm", lg: "md" }}
                            padding={{ base: [2, 4], lg: [1, 4] }}
                            onClick={this.signOutAccount}
                        >
                            Abmelden
                        </Button>
                    )}
                    <SignUpAndInModal
                        openModal={this.state.openSignUpAndInModal}
                        closeModal={this.closeSignUpAndInModal}
                        entrySite={this.state.signUpAndInModalSite}
                        onSignIn={() => {
                            this.signInAccount();
                        }}
                        onSignUp={() => {}}
                    />
                </Box>
            </Flex>
        );
    }
}

export default Header;
