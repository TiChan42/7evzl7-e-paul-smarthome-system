import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Card,
    CardHeader,
    Heading,
    Box,
    Text,
    Input
  } from '@chakra-ui/react'
  import React from 'react';
import { decryptString } from '@/utils/encryptionUtils';
import ValidateActionModal from '@/components/validateActionModal';

//Modal for signing up and in
const AccountSettingsModal = (props) => {

    //AccountId
    const [accountID, setAccountID] = React.useState(decryptString(sessionStorage.getItem('accountID')))
    const [openValidateDeleteAcc, setOpenValidateDeleteAcc] = React.useState(false)
    //Hier die ganzen Funktionen Hinpacken 


    const initialRef = React.useRef();

    const validateEmail = async () => {
        const res = await fetch('http://epaul-smarthome.de:8000/api/validateEmail', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                key: this.key,
                accountId: this.accountID,

            })
        });
        return res;
    };

    const updateEmail = async () => {
        var validated = await validateEmail();
        // try catch
        validated = await validated.json()
        // end

        if (validated == 1) {
            const res = await fetch('http://epaul-smarthome.de:8000/api/settings/changeMail', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: this.executingUserID,
                    accountId: this.accountID,
                    mail: this.state.newMail  //???
                })
            })
        }
        else {
            // Invalid Old Pin
            console.log("Old Email isn't correct")
        }
    };




    return (
        <>
            <Modal
                isOpen={props.openModal}
                onClose={props.closeModal}
                initialFocusRef={initialRef}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader >
                        Account-Einstellungen
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
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
                                    mailName = "oldMail"
                                    state = {this}
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
                                    mailName = "newMail"
                                    state = {this}

                                />

                                <Button onClick={updateEmail} margin={'2em'} align={'left'} colorScheme='whiteAlpha' variant='solid' fontSize={[12, 12, 16]}>Bestätigen</Button>
                                <br></br><br></br>
                                <Text color={"white"}>Hier können Sie Ihren Account löschen:</Text>
                                {/*<DeleteAcc />*/}
                                <Button onClick={() => setOpenValidateDeleteAcc(true)}>Account löschen</Button>
                                <ValidateActionModal openModal = {openValidateDeleteAcc} closeModal = {()=>{setOpenValidateDeleteAcc(false)}} title = {"Account löschen?"} content = {"Möchten Sie wirklich Ihren E-Paul Account löschen? Diese Aktion kann nicht rückgängig gemacht werden."} execute = {()=>{console.log("passt")}}/>
                            </Box>
                        </Card>
                    </ModalBody>
                    <ModalFooter>
                        <Button key={initialRef} mr={3} onClick={() => { props.closeModal() }}>
                            Schließen
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default AccountSettingsModal;