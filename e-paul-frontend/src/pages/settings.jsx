import { Tabs, FormControl, FormLabel, HStack, PinInput, PinInputField, show, Alert, AlertIcon, AlertTitle, AlertDescription, Text, Heading, Box, Card, Button, VStack, Stack, CardHeader, Image, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure, Select, InputGroup, InputRightElement, useToast } from "@chakra-ui/react";
import { decryptString } from '@/utils/encryptionUtils';
import React, { Component, useEffect, useState } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'

function InitialFocus() {
    const executingUserID = sessionStorage.getItem('executingUserID');
    const accountID = decryptString(sessionStorage.getItem('accountID'));
    const userID = decryptString(sessionStorage.getItem('userToEdit'));
    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);
    const { isOpen, onOpen, onClose } = useDisclosure()

    const deleteUser = async () => {
        console.log(executingUserID, accountID, userID)
        const res = await fetch('http://epaul-smarthome.de:8000/api/user/deleteUser', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userID,
                accountId: accountID,
                executingUserId: executingUserID
            })
        })

    };

    return (
        <>
            <Button onClick={onOpen} colorScheme='red' variant='solid' margin={'2em'}>User löschen</Button>
            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Möchten sie ihren User wirklich löschen?</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>

                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='red' variant='solid' onClick={deleteUser} marginRight={'1em'}>Bestätigen</Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

function AddToast(props) {
    const toast = useToast()
    // console.log(props.title + " " + props.status + " " + props.duration + " " + props.isClosable + " " + props.description)
    // console.log(props.trigger)
    useEffect(() => {
        if (props.trigger) {
            if (props.title && props.status && props.duration && props.isClosable && props.description) {
                toast({
                    title: props.title,
                    status: props.status,
                    duration: props.duration,
                    isClosable: props.isClosable,
                    description: props.description
                })
                props.afterTrigger()
            }
        }
    });

    return (<></>)
}

class Settings extends Component {
    state = { activeTab: 'allgemein', isModalOpen: false, toastTitle: "123", toastStatus: "error", toastDuration: 5000, toastIsClosable: true, toastDescription: "descr", openToastTrigger: false };
    executingUserID = decryptString(sessionStorage.getItem('executingUserID'));
    accountID = decryptString(sessionStorage.getItem('accountID'));
    userID = decryptString(sessionStorage.getItem('userToEdit'));

    renderContent() {
        const { activeTab } = this.state;
        const updateUsername = async () => {
            if (this.state.newUsername) {
                const res = await fetch('http://epaul-smarthome.de:8000/api/settings/changeUserInformation', {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        accountId: this.accountID,
                        userId: this.userID,
                        username: this.state.newUsername,
                        executingUserId: this.executingUserID
                    })
                })
                var message = await res.json()
                if (message.error == "Username existiert bereits.") {
                    console.log("username existiert bereits")
                    this.setState({
                        toastTitle: "Ungültige Eingabe",
                        toastDescription: "Dieser Username existiert bereits.",
                        toastStatus: "error",
                        toastIsClosable: true,
                        toastDuration: 5000,
                        openToastTrigger: true
                    })
                }
                else if (res.status != 400) {
                    console.log("erfolg")
                    this.setState({
                        toastTitle: "Erfolg!",
                        toastDescription: "Ihr Benutzername wurde erfolgreich geändert.",
                        toastStatus: "success",
                        toastIsClosable: true,
                        toastDuration: 5000,
                        openToastTrigger: true
                    })
                }
                else {
                    console.log("kaputt")
                }
            }
            else {
                this.setState({
                    toastTitle: "Ungültige Eingabe",
                    toastDescription: "Sie haben das Feld leer gelassen.",
                    toastStatus: "error",
                    toastIsClosable: true,
                    toastDuration: 5000,
                    openToastTrigger: true
                })
            }
        };

        const updateGender = async () => {
            const res = await fetch('http://epaul-smarthome.de:8000/api/settings/changeUserInformation', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    accountId: this.accountID,
                        userId: this.userID,
                        executingUserId: this.executingUserID,
                        gender: this.state.newGender

                })
            })
            this.setState({
                toastTitle: "Erfolg!",
                toastDescription: "Ihr Geschlecht wurde geändert.",
                toastStatus: "success",
                toastIsClosable: true,
                toastDuration: 5000,
                openToastTrigger: true
            })
        };

        const validatePin = async () => {
            console.log(this.accountID, this.userID, this.state.oldPin);
            console.log(JSON.stringify({
                accountId: this.accountID,
                userId: this.userID,
                pin: this.state.oldPin
            }))
            const res = await fetch('http://epaul-smarthome.de:8000/api/validatePin', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    accountId: this.accountID,
                    userId: this.userID,
                    pin: this.state.oldPin,
                })
            });
            return res;
        };

        const updatePin = async () => {
            var validated = await validatePin();
            // try catch
            validated = await validated.json()
            // end
            validated = validated["valid"]
            console.log(typeof validated)
            console.log(this.state.newPin, this.state.newPinRepeat)
            if (this.state.newPin == this.state.newPinRepeat) {
                if (validated == 1) {
                    this.setState({ wrongPinOpen: false })
                    const res = await fetch('http://epaul-smarthome.de:8000/api/settings/pin', {
                        method: 'PUT',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            userId: this.userID,
                            pin: this.state.newPin,
                            previousPin: this.state.oldPin
                        })
                    })

                    this.state.toastTitle = "Erfolg!"
                    this.state.toastDescription = "Ihr PIN wurde erfolgreich geändert."
                    this.state.toastStatus = "success"
                    this.state.toastIsClosable = true
                    this.state.toastDuration = 7000
                    this.state.openToastTrigger = true
                }
                else{
                    // Invalid Old Pin
                    this.setState({ wrongPinOpen: true })
                    console.log("old pin is not valid")
                    this.state.toastTitle = "PIN ist falsch!"
                    this.state.toastDescription = "Ihr eingegebener PIN ist falsch. Bitte versuchen Sie es erneut."
                    this.state.toastStatus = "error"
                    this.state.toastIsClosable = true
                    this.state.toastDuration = 7000
                    this.state.openToastTrigger = true
                }
                this.setState({ diffPinOpen: false })
            }
            else{
                // Pins are different
                this.state.toastTitle = "PINs sind verschieden!"
                this.state.toastDescription = "Geben Sie zwei mal den gleichen PIN ein, um diesen zu ändern."
                this.state.toastStaus = "error"
                this.state.toastIsClosable = true
                this.state.toastDuration = 7000
                this.state.openToastTrigger = true
                this.setState({ diffPinOpen: true })
                console.log("new pins are different")
            }
        };

        if (activeTab === 'allgemein') {
            return (
                <>
                    <AddToast onChange={"update"} title={this.state.toastTitle} status={this.state.toastStatus} duration={this.state.toastDuration} isClosable={this.state.toastIsClosable} description={this.state.toastDescription} trigger={this.state.openToastTrigger} afterTrigger={(() => { this.state.openToastTrigger = false })} />
                    <Card bg={"#218395"} w='100%' h='100%' >

                        <CardHeader>
                            <Heading size='lg' color={"white"}>Allgemein</Heading>
                        </CardHeader>
                        <Box m={4}>
                            <Text color={"white"}>Hier können Sie Ihren Benutzernamen ändern:</Text>
                            <Input
                                isInvalid
                                type="text"
                                errorBorderColor='white'
                                placeholder='Neuer Benutzername'
                                _placeholder={{ color: 'white' }}
                                focusBorderColor={'red'}
                                marginTop={'1em'}

                                value={this.state.newUsername}
                                onChange={(e) => this.setState({ newUsername: e.target.value })}
                            />
                            <Button onClick={updateUsername} margin={'2em'} align={'left'} colorScheme='whiteAlpha' variant='solid' fontSize={[12, 12, 16]}>Benutzernamen aktualisieren</Button>
                        </Box>

                        <Box m={4}>
                            <Text color={"white"}>Hier können Sie Ihr Geschlecht ändern:</Text>
                            <Select
                                errorBorderColor='white'
                                borderColor={'white'}
                                focusBorderColor={'red'}
                                placeholder='Geschlecht wählen'
                                marginTop={'1em'}
                                value={this.state.newGender}
                                onChange={(e) => this.setState({ newGender: e.target.value })}
                            >
                                <option value='männlich'>männlich</option>
                                <option value='weiblich'>weiblich</option>
                                <option value='divers'>divers</option>
                            </Select>
                            <Button onClick={updateGender} margin={'2em'} align={'left'} colorScheme='whiteAlpha' variant='solid' fontSize={[12, 12, 16]}>Geschlecht bestätigen</Button>
                            <br></br><br></br>
                            <Text color={"white"}>Hier können Sie Ihren User löschen:</Text>
                            <InitialFocus />
                        </Box>
                    </Card>
                </>
            );

        } else if (activeTab === 'modus') {
            return (
                <Card bg={"#218395"} w='100%' h='100%'>
                    <CardHeader>
                        <Heading size='lg' color={"white"}>Modus</Heading>
                    </CardHeader>
                    <Box align='end' m={4}>
                        Inhalt für Modus
                    </Box>
                </Card>
            );
        }
        else if (activeTab === 'konto') {
            return (
                <Card bg={"#218395"} w='100%' h='100%'>
                    <CardHeader>
                        <Heading size='lg' color={"white"}>Konto</Heading>
                    </CardHeader>
                    <Box m={4} width={'80%'}>
                        <Text color={"white"}>Hier können Sie Ihre Email-Adresse ändern:</Text>
                        <Input
                            isInvalid
                            type="text"
                            errorBorderColor='white'
                            borderColor={'green'}
                            placeholder='Aktuelle E-Mail-Adresse'
                            _placeholder={{ color: 'white' }}
                            focusBorderColor={'red'}
                            pattern="/^\S+@\S+\.\S+$/"
                            marginTop={'2em'}
                        />

                        <Input
                            isInvalid
                            type="text"
                            errorBorderColor='white'
                            borderColor={'green'}
                            placeholder='Neue E-Mail-Adresse'
                            _placeholder={{ color: 'white' }}
                            focusBorderColor={'red'}
                            pattern="/^\S+@\S+\.\S+$/"
                            marginTop={'2em'}
                        />

                        <Button margin={'2em'} align={'left'} colorScheme='whiteAlpha' variant='solid' fontSize={[12, 12, 16]}>Bestätigen</Button>
                    </Box>
                </Card>
            );

        }


        else if (activeTab === 'pin') {

            return (
                <>
                    <AddToast title={this.state.toastTitle} status={this.state.toastStatus} duration={this.state.toastDuration} isClosable={this.state.toastIsClosable} description={this.state.toastDescription} trigger={this.state.openToastTrigger} afterTrigger={(() => { this.state.openToastTrigger = false })} />
                    <Card bg={"#218395"} w='100%' h='100%'>
                        <CardHeader>
                            <Heading size='lg' color={"white"}>PIN</Heading>
                        </CardHeader>
                        <Box m={"4"} width={'80%'}>
                            <Text color={"white"}>Hier können Sie Ihren PIN ändern:</Text>
                            <Stack spacing={"3"} pt={"3"}>
                                <PasswordInput text="Alter PIN" pinName="oldPin" class={this} />
                                <Text color={"white"}>Hier nun den neuen gewünschten PIN eingeben</Text>
                                <PasswordInput text="Neuer PIN" pinName="newPin" class={this} />
                                <PasswordInput text="Neuen PIN Bestätigen" pinName="newPinRepeat" class={this} />
                            </Stack>
                            <Button onClick={updatePin} margin={'2em'} align={'left'} colorScheme='whiteAlpha' variant='solid' fontSize={[12, 12, 16]}>Bestätigen</Button>
                        </Box>
                    </Card>
                </>

            );
        }


    }

    render() {

        const { activeTab } = this.state;


        return (

            <Box display="flex" flexDirection="row" bg={"rgba(33, 131, 149, .8)"} height="100vh" margin={'1em'} borderRadius={'16px'}>
                <Box width="25%" p={4}>
                    <VStack alignItems="center">
                        <Image src='../../assets/img/paul.png' />
                        <Button onClick={() => this.setState({ activeTab: 'allgemein' })} colorScheme={activeTab === 'allgemein' ? "blue" : "gray"} width={'80%'}>
                            Allgemein
                        </Button>
                        <Button onClick={() => this.setState({ activeTab: 'pin' })} colorScheme={activeTab === 'pin' ? "blue" : "gray"} width={'80%'}>
                            PIN
                        </Button>
                        <Button color={'lightgray'} onClick={() => this.setState({ isDisabled: 'modus' })} colorScheme={activeTab === 'modus' ? "blue" : "gray"} width={'80%'}>
                            Modus
                        </Button>
                        <Button onClick={() => this.setState({ activeTab: 'konto' })} colorScheme={activeTab === 'konto' ? "blue" : "gray"} width={'80%'}>
                            Konto
                        </Button>
                    </VStack>
                </Box>
                <Box width="75%" p={4}>
                    {this.renderContent()}
                </Box>
            </Box>
        );
    }

}

export default Settings;



export function PasswordInput(props) {
    const [show, setShow] = React.useState(false)
    const handleClick = () => setShow(!show)

    return (
        <InputGroup size='md'>
            <Input
                onChange={(e) => props.class.setState({ [props.pinName]: e.target.value })}
                pr='4.5rem'
                type={show ? 'text' : 'password'}
                placeholder={props.text}
                _placeholder={{ color: 'white' }}
                focusBorderColor="black"
            />
            <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm' onClick={handleClick}>
                    {show ? 'Hide' : 'Show'}
                </Button>
            </InputRightElement>
        </InputGroup>
    )
}
