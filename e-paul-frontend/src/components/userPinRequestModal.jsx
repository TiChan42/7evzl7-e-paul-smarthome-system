
/**
 * Komponente für die Abfrage des Pins und (wenn nötig) des Benutzers.
 * 
 * @param {Object} props - Die Eigenschaften der Komponente.
 * @param {boolean} props.openModal - Gibt an, ob das Modal geöffnet ist oder nicht.
 * @param {Array} props.users - Die Liste der Benutzer.
 * @param {Function} props.closeModal - Die Funktion zum Schließen des Modals.
 * @param {Function} props.executeIfValid - Die Funktion, die ausgeführt wird, wenn der Pin gültig ist.
 * 
 * @returns {JSX.Element} Das UserPinRequestModal-Komponente.
 * 
 * @requires chakra-ui/react, react, ../utils/encryptionUtils, @chakra-ui/icons, ../utils/env
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
    FormHelperText,
    Select,
    Input,
    InputGroup,
    InputRightElement,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { encryptString, decryptString } from '../utils/encryptionUtils';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { env } from '../utils/env';

//Komponente für die Abfrage des Pins und (wenn nötig) des Benutzers
const UserPinRequestModal = (props) => {
    const [showPin, setShowPin] = React.useState(false);
    const [requireUserSelection, setRequireUserSelection] = useState(false);
    const [noPossibleUser, setNoPossibleUser] = useState(false);
    const [userSelectValue, setUserSelectValue] = useState(props.users[0].id);
    const handlePinShowClick = () => setShowPin(!showPin);

    //Versuch den Pin zu validieren
    const tryToSubmitPin = (target) => {
        if (target == null) return;
        const pin = target.value;
        const userID = requireUserSelection
            ? userSelectValue
            : decryptString(sessionStorage.getItem('executingUserID'));
        const data = {
            pin: pin,
            userId: userID,
            accountId: decryptString(sessionStorage.getItem('accountID')),
        };
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        };
        fetch(env()['api-path'] + 'validatePin', requestOptions)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (data.valid) {
                    target.value = '';
                    sessionStorage.setItem(
                        'executingUserID',
                        encryptString(userID.toString())
                    );
                    sessionStorage.setItem(
                        'userAuthorized',
                        encryptString('true')
                    );
                    props.closeModal();
                    props.executeIfValid();
                }
            })
            .catch((error) => {
                console.log(error);
                target.value = '';
            });
    };

    //Auswahl der Angezeigten Fensters zwischen Benutzerauswahl + Pin-Eingabe, oder nur Pin-Eingabe, oder keine Benutzer vorhanden
    useEffect(() => {
        if (sessionStorage.getItem('executingUserID') === '') {
            sessionStorage.setItem('userAuthorized', encryptString('false'));
            setRequireUserSelection(true);
            if (props.users[0] == null) {
                setNoPossibleUser(true);
            }
        } else {
            setRequireUserSelection(false);
        }
        tryToSubmitPin(inputRef.current);
        // eslint-disable-next-line
    }, [props.users, props.openModal]);

    const inputRef = React.createRef();

    return (
        <Modal
            initialFocusRef={inputRef}
            isOpen={props.openModal}
            onClose={props.closeModal}
        >
            <ModalOverlay />
            <ModalContent bg={'teal.50'}>
                {noPossibleUser && (
                    <React.Fragment>
                        <ModalHeader color='Red'>
                            Keine Benutzer vorhanden
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            Es sind keine Benutzer vorhanden. Bitte erstellen
                            Sie einen Benutzer.
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={props.closeModal}>
                                Schließen
                            </Button>
                        </ModalFooter>
                    </React.Fragment>
                )}
                {!noPossibleUser && (
                    <React.Fragment>
                        {requireUserSelection && props.users && (
                            <ModalHeader>Benutzerauswahl und Pin</ModalHeader>
                        )}
                        {!requireUserSelection && props.users && (
                            <ModalHeader>Pin eingeben</ModalHeader>
                        )}
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            {requireUserSelection && props.users && (
                                <FormControl>
                                    <FormLabel>
                                        ausführenden Benutzer auswählen
                                    </FormLabel>
                                    <Select
                                        borderColor={'teal.200'}
                                        _hover={{ borderColor: 'teal.300' }}
                                        focusBorderColor='teal.500'
                                        onChange={(event) => {
                                            setUserSelectValue(
                                                event.target.value
                                            );
                                        }}
                                    >
                                        {props.users.map((user) => (
                                            <React.Fragment
                                                key={
                                                    user.id +
                                                    'UserPinRequestModal'
                                                }
                                            >
                                                {(user.role === 'admin' ||
                                                    user.role ===
                                                        'superuser') && (
                                                    <option value={user.id}>
                                                        {user.username}
                                                    </option>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </Select>
                                    <br></br>
                                </FormControl>
                            )}
                            <FormControl>
                                <FormLabel>Pin zur Autorisierung</FormLabel>
                                <InputGroup size='md'>
                                    <Input
                                        ref={inputRef}
                                        pr='4.5rem'
                                        borderColor={'teal.200'}
                                        _hover={{ borderColor: 'teal.300' }}
                                        focusBorderColor='teal.500'
                                        maxLength='32'
                                        onChange={(event) =>
                                            tryToSubmitPin(event.target)
                                        }
                                        placeholder='Hier Pin eingeben...'
                                        type={showPin ? 'text' : 'password'}
                                    />
                                    <InputRightElement w='4.5rem'>
                                        <Button
                                            h='1.75rem'
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
                                <FormHelperText>
                                    Automatische Weiterleitung nach
                                    erfolgreicher Eingabe
                                </FormHelperText>
                            </FormControl>
                        </ModalBody>

                        <ModalFooter>
                            <Button
                                mr={2}
                                colorScheme='teal'
                                onClick={() => {
                                    tryToSubmitPin(inputRef.current);
                                }}
                            >
                                Anmelden
                            </Button>
                            <Button
                                colorScheme={'teal'}
                                onClick={props.closeModal}
                                variant={'outline'}
                            >
                                Schließen
                            </Button>
                        </ModalFooter>
                    </React.Fragment>
                )}
            </ModalContent>
        </Modal>
    );
};

export default UserPinRequestModal;
