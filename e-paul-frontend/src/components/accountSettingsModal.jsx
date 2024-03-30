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
    useToast,
} from '@chakra-ui/react';
import React from 'react';
import { decryptString } from '../utils/encryptionUtils';
import ValidateActionModal from './validateActionModal';

//Modal zum Ändern der Account-Einstellungen
const AccountSettingsModal = (props) => {
    const [accountID, setAccountID] = React.useState(
        decryptString(sessionStorage.getItem('accountID'))
    );
    const [openValidateDeleteAcc, setOpenValidateDeleteAcc] =
        React.useState(false);
    const [openChangeMail, setopenChangeMail] = React.useState(false);
    const [newMail, setNewMail] = React.useState('');

    const executingUserID = decryptString(
        sessionStorage.getItem('executingUserID')
    );
    const toast = useToast();

    const initialRef = React.useRef();
    
    //Funktion zum Ändern der E-Mail-Adresse
    const updateEmail = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(newMail)) {
            const res = await fetch(
                'http://epaul-smarthome.de:8000/api/settings/changeMail',
                {
                    method: 'PUT',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: executingUserID,
                        accountId: accountID,
                        mail: newMail,
                    }),
                }
            );
            toast({
                title: 'E-Mail erfolgreich geändert',
                description: 'Ihre E-Mail wurde erfolgreich geändert.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } else {
            toast({
                title: 'Die eingegebene E-Mail hat das falsche Format',
                description: 'Bitte geben Sie eine valide E-Mail Adresse ein',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    //Funktion zum Löschen des Accounts
    const deleteAccount = async () => {
        const res = await fetch(
            'http://epaul-smarthome.de:8000/api/deleteAccount',
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    executingUserId: parseInt(executingUserID),
                    accountId: parseInt(accountID),
                }),
            }
        );
        console.log(res);
        //Löschen der Session
        sessionStorage.clear();
        //Neuladen der Seite
        var waitTime = 2000;
        toast({
            title: 'Account erfolgreich gelöscht',
            description:
                'Ihr Account wurde erfolgreich gelöscht. Sie werden in Kürze zur Startseite weitergeleitet.',
            status: 'success',
            duration: waitTime,
            isClosable: true,
        });
        // Reload Page
        setTimeout(function () {
            window.location.reload();
        }, waitTime);
    };

    return (
        <>
            <Modal
                initialFocusRef={initialRef}
                isOpen={props.openModal}
                onClose={props.closeModal}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Account-Einstellungen</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Card
                            w='100%'
                            h='100%'
                            bg={'#218395'}
                        >
                            <CardHeader>
                                <Heading
                                    color={'white'}
                                    size='lg'
                                >
                                    Konto
                                </Heading>
                            </CardHeader>
                            <Box
                                w={'80%'}
                                m={4}
                            >
                                <Text color={'white'}>
                                    Hier können Sie Ihre Email-Adresse ändern:
                                </Text>
                                <Input
                                    mt={'2em'}
                                    borderColor={'green'}
                                    _placeholder={{ color: 'white' }}
                                    errorBorderColor='white'
                                    focusBorderColor={'red'}
                                    isInvalid
                                    onInput={(e) => setNewMail(e.target.value)}
                                    pattern='/^\S+@\S+\.\S+$/'
                                    placeholder='Neue E-Mail-Adresse'
                                    type='text'
                                    value={newMail}
                                />
                                <Button
                                    align={'left'}
                                    m={'2em'}
                                    fontSize={[12, 12, 16]}
                                    colorScheme='whiteAlpha'
                                    onClick={() => setopenChangeMail(true)}
                                    variant='solid'
                                >
                                    Bestätigen
                                </Button>
                                <ValidateActionModal
                                    openModal={openChangeMail}
                                    closeModal={() => {
                                        setopenChangeMail(false);
                                    }}
                                    title={'E-Mail ändern?'}
                                    content={
                                        'Möchten Sie wirklich Ihre E-Mail ändern?'
                                    }
                                    execute={updateEmail}
                                />
                                <br></br>
                                <br></br>
                                <Text color={'white'}>
                                    Hier können Sie Ihren Account löschen:
                                </Text>
                                <Button
                                    mt={'1em'}
                                    ml={'2em'}
                                    colorScheme='red'
                                    onClick={() =>
                                        setOpenValidateDeleteAcc(true)
                                    }
                                    variant='solid'
                                >
                                    Account löschen
                                </Button>
                                <ValidateActionModal
                                    openModal={openValidateDeleteAcc}
                                    closeModal={() => {
                                        setOpenValidateDeleteAcc(false);
                                    }}
                                    title={'Account löschen?'}
                                    content={
                                        'Möchten Sie wirklich Ihren E-Paul Account löschen? Diese Aktion kann nicht rückgängig gemacht werden.'
                                    }
                                    execute={deleteAccount}
                                />
                            </Box>
                        </Card>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            key={initialRef}
                            mr={3}
                            onClick={() => {
                                props.closeModal();
                            }}
                        >
                            Schließen
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default AccountSettingsModal;
