import { Heading, Box, Card, Button, VStack, CardHeader, Tabs, Image, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, ModalFooter, useDisclosure, Select, HStack, PinInput, PinInputField } from "@chakra-ui/react";
import { decryptString } from '../../encryptionUtils';
import React, { Component } from 'react';
import { ViewIcon, ViewOffIcon} from '@chakra-ui/icons'



function InitialFocus() {
    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);
    const { isOpen, onOpen, onClose } = useDisclosure()

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
                        <FormControl mt={4}>
                            <FormLabel>Pin eingeben</FormLabel>
                            <Input placeholder='Pin' ref={initialRef} />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        {/*<Button colorScheme='blue' mr={3} onClick={deleteAccount}>Bestätigen</Button>*/}
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}



class Settings extends Component {
    state = { activeTab: 'profil', isModalOpen: false };
    userID = sessionStorage.getItem('executingUserID');
    accountID = sessionStorage.getItem('accountID');


    renderContent() {
        const { activeTab } = this.state;
        const updateUsername = async () => {

            console.log(this.userID, this.accountID)
            console.log(JSON.stringify({
                accountId: this.accountID,
                userId: this.userID,
                gender: "male",
                username: "TestUser"
            }))
            const res = await fetch('http://epaul-smarthome.de:8000/api/settings/' + this.userID, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    accountId: this.accountID,
                    gender: "male",
                    username: this.state.newUsername
                })
            })

            //const data = await res.json();
            console.log(res.body);

        };
        //funktioniert noch nicht, da keine Infos in Methoden gefunden
        const updateBirthdate = async () => {
            const res = await fetch('http://epaul-smarthome.de:8000/api/settings/' + this.userID, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    accountId: this.accountID,
                    gender: "male",
                    username: this.username,
                    birthdate: this.state.newBirthdate
                })
            })

        };



        const deleteAccount = async () => {
            const res = await fetch('http://epaul-smarthome.de:8000/api/user/' + this.userID, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: this.userID
                })
            })

        };


        const updateGender = async () => {

            console.log(this.userID, this.accountID)
            console.log(JSON.stringify({
                accountId: this.accountID,
                userId: this.userID,
                gender: "male",
                username: this.username
            }))
            const res = await fetch('http://epaul-smarthome.de:8000/api/settings/' + this.userID, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    accountId: this.accountID,
                    gender: this.state.newGender,
                    username: this.state.newUsername
                })
            })

            //const data = await res.json();
            console.log(res.body);

        };



        if (activeTab === 'profil') {
            return (
                <Card bg={"#218395"} w='100%' h='100%' >
                    <CardHeader>
                        <Heading size='lg' color={"white"}>Profil</Heading>
                    </CardHeader>
                    <Box m={4}>
                        <p>Hier können Sie Ihren Benutzernamen ändern:</p>
                        <Input
                            isInvalid
                            type="text"
                            errorBorderColor='white'
                            borderColor={'green'}
                            placeholder='Neuer Benutzername'
                            _placeholder={{ color: 'white' }}
                            focusBorderColor={'red'}
                            marginTop={'1em'}

                            value={this.state.newUsername}
                            onChange={(e) => this.setState({ newUsername: e.target.value })}
                        />
                        <Button onClick={updateUsername} margin={'2em'} align={'left'} colorScheme='teal' variant='solid' fontSize={[12, 12, 16]}>Benutzernamen aktualisieren</Button>
                    </Box>

                    <Box m={4}>
                        <p>Hier können Sie Ihr Geschlecht ändern:</p>
                        <Select color={'white'} errorBorderColor='white' borderColor={'white'} focusBorderColor={'red'} placeholder='Geschlecht wählen' marginTop={'1em'}
                            value={this.state.newGender}
                            onChange={(e) => this.setState({ newGender: e.target.value })}>
                            <option value='option1'>männlich</option>
                            <option value='option2'>weiblich</option>
                            <option value='option3'>divers</option>
                        </Select>
                        <Button onClick={updateGender} margin={'2em'} align={'left'} colorScheme='teal' variant='solid' fontSize={[12, 12, 16]}>Geschlecht bestätigen</Button>
                        <br></br><br></br>
                            <InitialFocus/>
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
        else if (activeTab === 'konto') {
            return (
                <Card bg={"#218395"} w='100%' h='100%'>
                    <CardHeader>
                        <Heading size='lg' color={"white"}>Konto</Heading>
                    </CardHeader>
                    <Box m={4} width={'80%'}>
                        <p>Hier können Sie Ihre Email-Adresse ändern:</p>
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

                        <Button margin={'2em'} align={'left'} colorScheme='teal' variant='solid' fontSize={[12, 12, 16]}>Bestätigen</Button>
                    </Box>
                </Card>
            );

        }


        else if (activeTab === 'sicherheit') {
            return (
                <Card bg={"#218395"} w='100%' h='100%'>
                    <CardHeader>
                        <Heading size='lg' color={"white"}>Sicherheit</Heading>
                    </CardHeader>
                    <Box m={4} width={'80%'}>
                        <p>Hier können Sie Ihren Pin ändern:</p>
                        
                        <HStack marginTop={'1em'}>
                            <PinInput mask variant={'filled'}>
                                <PinInputField />
                                <PinInputField />
                                <PinInputField />
                                <PinInputField />
                            </PinInput>
                        </HStack>

                        <HStack marginTop={'3em'}>
                            <PinInput mask variant={'filled'}>
                                <PinInputField />
                                <PinInputField />
                                <PinInputField />
                                <PinInputField />
                            </PinInput>
                        </HStack>


                        <Button margin={'2em'} align={'left'} colorScheme='teal' variant='solid' fontSize={[12, 12, 16]}>Bestätigen</Button>
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
                        <Button onClick={() => this.setState({ activeTab: 'profil' })} colorScheme={activeTab === 'profil' ? "blue" : "gray"} width={'80%'}>
                            Profil
                        </Button>
                        <Button onClick={() => this.setState({ activeTab: 'sicherheit' })} colorScheme={activeTab === 'sicherheit' ? "blue" : "gray"} width={'80%'}>
                            Sicherheit
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
