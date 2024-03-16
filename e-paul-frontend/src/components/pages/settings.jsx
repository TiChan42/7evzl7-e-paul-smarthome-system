import { Alert, AlertIcon, AlertTitle, AlertDescription, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, AlertDialogContent, Text, Heading, Box, Card, Button, VStack, Stack, CardHeader, Tabs, Image, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, ModalFooter, useDisclosure, Select, HStack, PinInput, PinInputField, show, InputGroup, InputRightElement } from "@chakra-ui/react";
import { decryptString } from '../../encryptionUtils';
import React, { Component, useEffect, useState } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'

function InitialFocus() {
    const executingUserID = sessionStorage.getItem('executingUserID');
    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);
    const { isOpen, onOpen, onClose } = useDisclosure()

    const deleteUser = async () => {
        console.log(executingUserID)
        const res = await fetch('http://epaul-smarthome.de:8000/api/user/' + executingUserID, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: executingUserID
            })
        })

    };

    useEffect(() => {
        decryptString(sessionStorage.getItem('userToEdit'))
    }, [])

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


function DeleteAcc() {
    const executingUserID = sessionStorage.getItem('executingUserID');
    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);
    const { isOpen, onOpen, onClose } = useDisclosure()

    const deleteAccount = async () => {
        console.log(executingUserID)
        const res = await fetch('http://epaul-smarthome.de:8000/api/user/' + executingUserID, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: executingUserID
            })
        })

    };

    useEffect(() => {
        decryptString(sessionStorage.getItem('userToEdit'))
    }, [])

    return (
        <>
            <Button onClick={onOpen} colorScheme='red' variant='solid' margin={'2em'}>Account löschen</Button>

            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Möchten sie ihren Account wirklich löschen?</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>

                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='red' variant='solid' onClick={deleteAccount} marginRight={'1em'}>Bestätigen</Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}


class Settings extends Component {
    state = { activeTab: 'allgemein', isModalOpen: false};
    executingUserID = sessionStorage.getItem('executingUserID');
    accountID = decryptString(sessionStorage.getItem('accountID'));
    userID = decryptString(sessionStorage.getItem('userToEdit'));



    renderContent() {
        const { activeTab } = this.state;

        const updateUsername = async () => {
            const res = await fetch('http://epaul-smarthome.de:8000/api/settings/' + this.userID, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    accountId: this.accountID,
                    username: this.state.newUsername
                })
            })
        };

        const updateGender = async () => {
            const res = await fetch('http://epaul-smarthome.de:8000/api/settings/' + this.userID, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    accountId: this.accountID,
                    gender: this.state.newGender
                })
            })
        };

        const validatePin = async () => {
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
            if (this.state.newPin == this.state.newPinRepeat) {
                if (validated == 1) {
                    this.setState({wrongPinOpen : false})
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
                }
                else {
                    // Invalid Old Pin
                    this.setState({wrongPinOpen : true})
                    console.log("old pin is not valid")
                }
                this.setState({diffPinOpen : false})
            }
            else {
                // Pins are different
                this.setState({diffPinOpen : true})
                console.log("new pins are different")


            }
        };

        if (activeTab === 'allgemein') {
            return (
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
        else if (activeTab === 'pin') {

            return (
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
                        <AlertDialogExample open={this.state.wrongPinOpen} alertStatus={"error"} alertTitle={"Ihre alte PIN ist falsch!"} AlertDescription={"Bitte versuchen Sie es erneut."}/>
                        <AlertDialogExample open={this.state.diffPinOpen} alertStatus={"error"} alertTitle={"Die PINs stimmen nicht überein!"} AlertDescription={"Bitte versuchen Sie es erneut."}/>
                        <Button onClick={updatePin} margin={'2em'} align={'left'} colorScheme='whiteAlpha' variant='solid' fontSize={[12, 12, 16]}>Bestätigen</Button>
                    </Box>
                </Card>

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



function PasswordInput(props) {
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


function AlertDialogExample(props) {
    var openvar = props.open
    return (
        <>
        {openvar ? 
            <Alert status={props.alertStatus} >
                <AlertIcon />
                <AlertTitle>{props.alertTitle}</AlertTitle>
                <AlertDescription>{props.AlertDescription}</AlertDescription>
            </Alert>
        : <></> }
        </>
    )
}
