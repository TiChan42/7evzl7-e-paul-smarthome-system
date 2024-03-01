import { Heading, Box, Card, Button, VStack, CardHeader, Tabs, Image, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, ModalFooter, useDisclosure } from "@chakra-ui/react";
import { decryptString } from '../../encryptionUtils';
import React, { Component } from 'react';


function InitialFocus({ isOpen, onClose }) {
    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);

    return (
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
                    <Button colorScheme='blue' mr={3}>
                        Bestätigen
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}



class Settings extends Component {
    state = { activeTab: 'profil',  isModalOpen: false};
    userID = decryptString(sessionStorage.getItem('executingUserID').toString());

    

    renderContent() {
        const { activeTab } = this.state;
        if (activeTab === 'profil') {
            return (
                <Card bg={"#218395"} w='100%' h='100%' >
                    <CardHeader>
                        {this.userID}
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
                        <Button onClick={this.updateUsername} margin={'2em'} align={'left'} colorScheme='teal' variant='solid' fontSize={[12, 12, 16]}>Benutzernamen aktualisieren</Button>
                    </Box>
                    <Box m={4}>
                        <p>Hier können Sie Ihr Geburtsdatum ändern:</p>
                        <Input
                            isInvalid
                            type="text"
                            errorBorderColor='white'
                            borderColor={'green'}
                            placeholder='dd.mm.jjjj'
                            _placeholder={{ color: 'white' }}
                            focusBorderColor={'red'}
                            pattern="(^(((0[1-9]|1[0-9]|2[0-8])[\.](0[1-9]|1[012]))|((29|30|31)[\.](0[13578]|1[02]))|((29|30)[\/](0[4,6,9]|11)))[\.](19|[2-9][0-9])\d\d$)|(^29[\.]02[\.](19|[2-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96)$)"
                            value={this.state.newBirthdate}
                            onChange={(e) => this.setState({ newBirthdate: e.target.value })}
                            marginTop={'1em'}
                        />
                        <Button onClick={this.updateBirthdate} margin={'2em'} align={'left'} colorScheme='teal' variant='solid' fontSize={[12, 12, 16]}>Geburtsdatum aktualisieren</Button>
                        <Button margin={'2em'} align={'left'} colorScheme='teal' variant='solid' fontSize={[12, 12, 16]}>Account löschen</Button>
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
    }

    render() {

        const { activeTab} = this.state;

        return (
            
            <Box display="flex" flexDirection="row" bg={"rgba(33, 131, 149, .8)"} height="100vh" margin={'1em'} borderRadius={'16px'}>
                <Box width="25%" p={4}>
                    <VStack alignItems="flex-start">
                        <Image src='../../assets/img/paul.png' />
                        <Button onClick={() => this.setState({ activeTab: 'profil' })} colorScheme={activeTab === 'profil' ? "blue" : "gray"} width={'80%'}>
                            Profil
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
