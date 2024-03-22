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
    Input,
    useToast
} from '@chakra-ui/react'
import React from 'react';
import { decryptString } from '../encryptionUtils';
import ValidateActionModal from './validateActionModal';

//Modal for signing up and in
const AccountSettingsModal = (props) => {

    //AccountId
    const [accountID, setAccountID] = React.useState(decryptString(sessionStorage.getItem('accountID')))
    const [openValidateDeleteAcc, setOpenValidateDeleteAcc] = React.useState(false)
    const [openChangeMail, setopenChangeMail] = React.useState(false)
    const [newMail, setNewMail] = React.useState("")
    //const [validEmail, setValidEmail] = React.useState(true);
    //Hier die ganzen Funktionen Hinpacken 

    const executingUserID = decryptString(sessionStorage.getItem('executingUserID'));
    const toast = useToast()

    const initialRef = React.useRef();

    const updateEmail = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        //setValidEmail(emailRegex.test(newMail));
        if(emailRegex.test(newMail)){
            const res = await fetch('http://epaul-smarthome.de:8000/api/settings/changeMail', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: executingUserID,
                    accountId: accountID,
                    mail: newMail
                })
            })
            toast({
                title: 'E-Mail erfolgreich geändert',
                description: 'Ihre E-Mail wurde erfolgreich geändert.',
                status: 'success',
                duration: 3000,
                isClosable: true
            });
        }
        else{
            toast({
                title: 'Die eingegebene E-Mail hat das falsche Format',
                description: 'Bitte geben Sie eine valide E-Mail Adresse ein',
                status: 'error',
                duration: 5000,
                isClosable: true
            });
        }
    };

    const deleteAccount = async () => {
        // API Request
        const res = await fetch('http://epaul-smarthome.de:8000/api/deleteAccount', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                executingUserId: parseInt(executingUserID),
                accountId: parseInt(accountID)
            })
        })
        console.log(res)
        // Clear Session Storage
        sessionStorage.clear()
        // Toast and Page reload
        var waitTime = 2000
        toast({
            title: 'Account erfolgreich gelöscht',
            description: 'Ihr Account wurde erfolgreich gelöscht. Sie werden in Kürze zur Startseite weitergeleitet.',
            status: 'success',
            duration: waitTime,
            isClosable: true
        });
        // Reload Page
        setTimeout(function () { window.location.reload() }, waitTime)
    }


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
                                    placeholder='Neue E-Mail-Adresse'
                                    _placeholder={{ color: 'white' }}
                                    focusBorderColor={'red'}
                                    pattern="/^\S+@\S+\.\S+$/"
                                    marginTop={'2em'}
                                    value={newMail}
                                    onInput={e => setNewMail(e.target.value)}
                                />
                                <Button onClick={() => setopenChangeMail(true)} margin={'2em'} align={'left'} colorScheme='whiteAlpha' variant='solid' fontSize={[12, 12, 16]}>Bestätigen</Button>
                                <ValidateActionModal openModal={openChangeMail} closeModal={() => { setopenChangeMail(false) }} title={"E-Mail ändern?"} content={"Möchten Sie wirklich Ihre E-Mail ändern?"} execute={updateEmail} />
                                <br></br><br></br>
                                <Text color={"white"}>Hier können Sie Ihren Account löschen:</Text>
                                <Button onClick={() => setOpenValidateDeleteAcc(true)} colorScheme='red' variant='solid' marginLeft={'2em'} marginTop={'1em'}>Account löschen</Button>
                                <ValidateActionModal openModal={openValidateDeleteAcc} closeModal={() => { setOpenValidateDeleteAcc(false) }} title={"Account löschen?"} content={"Möchten Sie wirklich Ihren E-Paul Account löschen? Diese Aktion kann nicht rückgängig gemacht werden."} execute={deleteAccount} />
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