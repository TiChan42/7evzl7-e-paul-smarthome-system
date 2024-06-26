/**
 * Komponente für das Hinzufügen eines Benutzers (Modal)
 *
 * @component
 * @example
 * return (
 *   <AddUserModal
 *     openModal={true}
 *     closeModal={handleCloseModal}
 *     requireAdmin={true}
 *     disableClose={false}
 *   />
 * )
 * @param {boolean} openModal - Indikator ob das Modal geöffnet ist
 * @param {function} closeModal - Funktion zum Schließen des Modals
 * @param {boolean} requireAdmin - Indikator ob der Benutzer ein Admin sein muss
 * @param {boolean} disableClose - Indikator ob das Schließen des Modals deaktiviert ist
 * @returns {JSX.Element} Das AddUserModal
 * 
 * @requires chakra-ui/react
 * @requires react
 * @requires utils/encryptionUtils
 * @requires utils/randomUsernameGenerator
 * @requires utils/env
 * 
 */
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    InputGroup,
    InputRightElement,
    Checkbox,
    useToast,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { decryptString } from '../utils/encryptionUtils';
import { generateRandomUsername } from '../utils/randomUsernameGenerator';
import { ViewIcon, ViewOffIcon, RepeatIcon } from '@chakra-ui/icons';
import { env } from '../utils/env';

//Komponente für das Hinzufügen eines Benutzers (Modal)
const AddUserModal = (props) => {
    const toast = useToast();

    //Indikator ob der Pin angezeigt werden soll
    const [showPin, setShowPin] = React.useState(false);
    const handlePinShowClick = () => setShowPin(!showPin);

    //Generierter Benutzername
    const [generatedName, setGeneratedName] = useState(
        generateRandomUsername()
    );
    const handleRefreshName = () => setGeneratedName(generateRandomUsername());

    //Eingabefelder
    const [userName, setUserName] = useState(generatedName);
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [isAdmin, setIsAdmin] = useState(props.requireAdmin ? true : false);

    //Executing User Rights
    const [showMakeAdmin, setShowMakeAdmin] = useState(false);

    //Updater für den Benutzernamen
    useEffect(() => {
        setUserName(generatedName);
    }, [generatedName]);

    //Indikator ob der Erstellen-Button angezeigt werden soll
    const [showCreateButton, setShowCreateButton] = useState(
        !props.requireAdmin
    );

    //Überprüft ob die Eingaben korrekt sind
    useEffect(() => {
        if (userName.length > 0) {
            if (password === passwordRepeat) {
                if (isAdmin) {
                    if (password.length >= 6) {
                        setShowCreateButton(true);
                    } else {
                        setShowCreateButton(false);
                    }
                } else {
                    setShowCreateButton(true);
                }
            } else {
                setShowCreateButton(false);
            }
        } else {
            setShowCreateButton(false);
        }
    }, [password, passwordRepeat, isAdmin, userName]);

    //Erstellt den Benutzer basierend auf den Eingaben
    const createUser = () => {
        const data = {
            executingUserId: sessionStorage.getItem('executingUserID')
                ? decryptString(sessionStorage.getItem('executingUserID'))
                : null,
            username: userName,
            pin: password,
            isAdmin: isAdmin,
            accountId: decryptString(sessionStorage.getItem('accountID')),
            userImageName: 'user_profile_0.jpg',
        };
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        };
        fetch(env()['api-path'] + 'signUp/user', requestOptions)
            .then((response) => {
                if (response.status === 201) {
                    props.closeModal();
                    setGeneratedName(generateRandomUsername());
                    //Reet all useState Values
                    setUserName(generatedName);
                    setPassword('');
                    setPasswordRepeat('');
                    setIsAdmin(false);

                    toast({
                        title: 'Benutzer erfolgreich erstellt',
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                    });
                } else {
                    toast({
                        title: 'Benutzer konnte nicht erstellt werden',
                        description: 'Bitte versuchen Sie es erneut',
                        status: 'error',
                        duration: 7000,
                        isClosable: true,
                    });
                }
            })
            .catch((error) => {
                console.log(error);
                toast({
                    title: 'Benutzer konnte nicht erstellt werden',
                    description: 'Bitte versuchen Sie es erneut',
                    status: 'error',
                    duration: 7000,
                    isClosable: true,
                });
            });
    };

    //Holt sich die Rechte des ausführenden Benutzers
    const getExecutingUserRights = () => {
        const executingUserID = decryptString(
            sessionStorage.getItem('executingUserID')
        );
        if (
            executingUserID !== null &&
            executingUserID !== '' &&
            executingUserID !== undefined
        ) {
            let url =
                env()['api-path'] +
                'getUserRights/' +
                executingUserID +
                '/' +
                executingUserID;
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            fetch(url, requestOptions)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    if (data['mayChangeUserType'] === 1) {
                        setShowMakeAdmin(true);
                    } else {
                        setShowMakeAdmin(false);
                    }
                })
                .catch((error) => {
                    console.error('Error(getExecutingUserRights):', error);
                });
        }
    };

    //Holt sich die Rechte des ausführenden Benutzers beim Laden der Komponente
    useEffect(() => {
        getExecutingUserRights();
    }, []);

    return (
        <>
            <Modal
                closeOnOverlayClick={!props.disableClose}
                isOpen={props.openModal}
                onClose={props.closeModal}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Benutzer erstellen</ModalHeader>
                    {!props.disableClose && <ModalCloseButton />}
                    <ModalBody>
                        <FormControl
                            isInvalid={userName.length === 0}
                            isRequired
                        >
                            <FormLabel>Benutzername</FormLabel>
                            <InputGroup size='md'>
                                <Input
                                    pr='4.5rem'
                                    focusBorderColor='teal.500'
                                    maxLength={12}
                                    onChange={(e) =>
                                        setUserName(e.target.value)
                                    }
                                    placeholder='Benutzernamen aussuchen...'
                                    type='text'
                                    value={userName}
                                />
                                <InputRightElement w='4.5rem'>
                                    <Button
                                        h='1.75rem'
                                        onClick={handleRefreshName}
                                        size='sm'
                                    >
                                        <RepeatIcon />
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                            {userName.length === 0 && (
                                <FormErrorMessage>
                                    Der Benutzername darf nicht leer sein
                                </FormErrorMessage>
                            )}
                        </FormControl>
                        <br></br>
                        <FormControl
                            isDisabled={userName.length === 0}
                            isInvalid={
                                isAdmin &&
                                password.length < 6 &&
                                userName.length !== 0
                            }
                            isRequired={isAdmin}
                        >
                            <FormLabel>Pin</FormLabel>
                            <InputGroup size='md'>
                                <Input
                                    pr='4.5rem'
                                    focusBorderColor='teal.500'
                                    maxLength='32'
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder='Hier Pin eingeben...'
                                    type={showPin ? 'text' : 'password'}
                                />
                                <InputRightElement w='4.5rem'>
                                    <Button
                                        h='1.75rem'
                                        isDisabled={userName.length === 0}
                                        onClick={handlePinShowClick}
                                        size='sm'
                                    >
                                        {showPin ? (
                                            <ViewIcon />
                                        ) : (
                                            <ViewOffIcon />
                                        )}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                            {isAdmin &&
                                password.length < 6 &&
                                userName.length !== 0 && (
                                    <FormErrorMessage>
                                        Der Pin muss mindestens 6 Zeichen lang
                                        sein
                                    </FormErrorMessage>
                                )}
                        </FormControl>
                        <br></br>
                        <FormControl
                            isDisabled={
                                userName.length === 0 ||
                                (isAdmin && password.length < 6)
                            }
                            isInvalid={
                                (isAdmin && password !== passwordRepeat) ||
                                password !== passwordRepeat
                            }
                            isRequired={isAdmin}
                        >
                            <FormLabel>Pin widerholen</FormLabel>
                            <InputGroup size='md'>
                                <Input
                                    pr='4.5rem'
                                    focusBorderColor='teal.500'
                                    maxLength='32'
                                    onChange={(e) =>
                                        setPasswordRepeat(e.target.value)
                                    }
                                    placeholder='Pin widerholen...'
                                    type={showPin ? 'text' : 'password'}
                                />
                                <InputRightElement w='4.5rem'>
                                    <Button
                                        h='1.75rem'
                                        isDisabled={
                                            userName.length === 0 ||
                                            (isAdmin && password.length < 6)
                                        }
                                        onClick={handlePinShowClick}
                                        size='sm'
                                    >
                                        {showPin ? (
                                            <ViewIcon />
                                        ) : (
                                            <ViewOffIcon />
                                        )}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                            {password !== passwordRepeat && (
                                <FormErrorMessage>
                                    Die Pins stimmen nicht überein
                                </FormErrorMessage>
                            )}
                        </FormControl>
                        <br></br>
                        <FormControl
                            alignItems='center'
                            display='flex'
                        >
                            <Checkbox
                                colorScheme='teal'
                                defaultChecked={props.requireAdmin}
                                isDisabled={
                                    props.requireAdmin || !showMakeAdmin
                                }
                                onChange={(e) => setIsAdmin(e.target.checked)}
                                size='lg'
                            >
                                Soll der Benutzer ein Admin sein?
                            </Checkbox>
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        {!props.disableClose && (
                            <Button
                                mr={3}
                                onClick={props.closeModal}
                            >
                                Schließen
                            </Button>
                        )}
                        <Button
                            colorScheme='teal'
                            isDisabled={!showCreateButton}
                            onClick={() => createUser()}
                        >
                            Erstellen
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default AddUserModal;
