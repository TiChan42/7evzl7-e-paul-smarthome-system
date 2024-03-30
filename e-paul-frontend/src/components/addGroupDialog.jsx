/**
 * Dialog zum Hinzufügen einer Gruppe.
 *
 * @component
 * @example
 * return (
 *   <AddGroupDialog
 *     updateGroup={updateGroup}
 *   />
 * );
 * @param {Function} props.updateGroup - Funktion zum Aktualisieren der Gruppen.
 * @returns {JSX.Element} Der Dialog zum Hinzufügen einer Gruppe.
 * @requires react
 * @requires @chakra-ui/react
 * @requires @chakra-ui/icons
 * @requires ../utils/encryptionUtils
 * @requires ../utils/env
 * @requires ./multiselect
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
    useDisclosure,
    Button,
    Input,
    FormControl,
    FormLabel,
    FormErrorMessage,
    InputGroup,
    useToast,
    Tooltip,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import MultiSelect from './multiselect';
import React, { useState, useEffect } from 'react';
import { decryptString } from '../utils/encryptionUtils';
import { env } from '../utils/env';

//Dialog zum Hinzufügen einer Gruppe
function AddGroupDialog(props) {
    const toast = useToast();

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [accountClients, setAccountClients] = useState([]);
    const [userClientIDs, setUserClientIDs] = useState([]);
    const [assignedUserClients, setAssignedUserClients] = useState([]);
    const [preparedAssignedUserClients, setPreparedAssignedUserClients] =
        useState([]);
    const [selectedClientIDs, setSelectedClientIDs] = useState([]);

    //Funktionen zum Abrufen der Clients des Accounts
    const fetchAccountClients = () => {
        let accountID = decryptString(sessionStorage.getItem('accountID'));
        if (accountID) {
            fetch(env()['api-path'] + 'getPorts/' + accountID, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    setAccountClients(data);
                })
                .catch((error) => {
                    console.error('Error(fetchAccountClients):', error);
                    setAccountClients([]);
                });
        }
    };

    //Funktion zum Abrufen der Client-IDs des Users
    const fetchUserClientIDs = () => {
        let userID = decryptString(sessionStorage.getItem('executingUserID'));
        if (userID) {
            fetch(env()['api-path'] + 'getGroup/Assignment/' + userID, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    setUserClientIDs(data[1]);
                })
                .catch((error) => {
                    console.error('Error(fetchUserClientIDs):', error);
                    setUserClientIDs([]);
                });
        }
    };

    //Funktion zum Filtern der Clients des Accounts nach den Client-IDs des Users
    useEffect(() => {
        let temp = [];
        if (
            accountClients &&
            userClientIDs &&
            accountClients[0] &&
            userClientIDs[0]
        ) {
            accountClients.forEach((client) => {
                if (userClientIDs.includes(client.id)) {
                    temp.push(client);
                }
            });
        }
        setAssignedUserClients(temp);
    }, [userClientIDs, accountClients]);

    //Funktion zum Generieren eines Namens aus der ID
    const generateNameOutOfID = (id) => {
        let temp = (id * 2345 + id * 856 + id * 71) / (id * id * id);
        //More complex function to generate a name out of the id
        temp = parseInt((temp * 2345 + temp * 856 + temp * 71) / (id * id));
        return 'Client_' + temp.toString();
    };

    //Funktion zum Vorbereiten der Clients des Users für die Multiselect-Komponente
    useEffect(() => {
        let temp = [];
        if (assignedUserClients && assignedUserClients[0]) {
            assignedUserClients.forEach((client) => {
                temp.push({
                    name: client.name
                        ? client.name
                        : generateNameOutOfID(client.id),
                    value: client.id,
                });
            });
        }
        setPreparedAssignedUserClients(temp);
    }, [assignedUserClients]);

    const [groupNameInUse, setGroupNameInUse] = useState(false);
    const [groupNameValid, setGroupNameValid] = useState(false);
    const [groupNameValue, setGroupNameValue] = useState('');

    //Testen ob der Gruppenname bereits vergeben ist
    const isGroupNameInUse = (groupName) => {
        let userID = decryptString(sessionStorage.getItem('executingUserID'));
        if (userID) {
            fetch(env()['api-path'] + 'getGroup/Standard/' + userID, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    let groupNames = data.map((group) => group['name']);
                    setGroupNameInUse(groupNames.includes(groupName));
                    setGroupNameValid(
                        groupName.length > 0 &&
                            groupName.length <= 32 &&
                            !groupNames.includes(groupName)
                    );
                })
                .catch((error) => {
                    setGroupNameValid(false);
                    console.error('Error(isGroupNameInUse):', error);
                });
        }
    };

    //Funktion zum Ändern des Gruppennamens nach Eingabe
    const handleGroupNameChange = (event) => {
        let groupName = event.target.value;
        isGroupNameInUse(groupName);
        setGroupNameValue(groupName);
    };

    //Funktionen zum Abrufen der Clients des Accounts und der Client-IDs des Users
    useEffect(() => {
        fetchAccountClients();
        fetchUserClientIDs();
        setGroupNameValid(false);
    }, [isOpen]);

    //Funktion zum Hinzufügen einer Gruppe
    const addGroup = () => {
        let userID = decryptString(sessionStorage.getItem('executingUserID'));
        if (userID) {
            fetch(env()['api-path'] + 'user/addGroup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userID,
                    name: groupNameValue,
                    clientIds: selectedClientIDs,
                }),
            })
                .then((response) => {
                    if (response.status === 201) {
                        toast({
                            title: 'Gruppe erfolgreich hinzugefügt',
                            status: 'success',
                            duration: 3000,
                            isClosable: true,
                        });
                        onClose();
                        props.updateGroup();
                    }
                })
                .catch((error) => {
                    console.error('Error(addGroup):', error);
                    toast({
                        title: 'Fehler beim Hinzufügen der Gruppe',
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                });
        }
    };

    return (
        <>
            <Tooltip
                color={'teal.100'}
                bg={'secondary.700'}
                hasArrow
                label='Hinzufügen einer Gruppe'
                placement='auto'
            >
                <Button
                    color={'secondary.700'}
                    bg={'teal.200'}
                    _hover={{ bg: 'teal.100' }}
                    _active={{ bg: 'secondary.500', color: 'teal.100' }}
                    onClick={onOpen}
                    variant={'solid'}
                >
                    <AddIcon mr={2}></AddIcon>
                    Gruppe Hinzufügen
                </Button>
            </Tooltip>

            <Modal
                isOpen={isOpen}
                onClose={onClose}
                size={{ base: 'full', sm: 'md' }}
            >
                <ModalOverlay />
                <ModalContent bg={'teal.50'}>
                    <ModalHeader>Gruppe Hinzufügen</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl
                            isInvalid={!groupNameValid}
                            isRequired
                        >
                            <FormLabel>Name der Gruppe</FormLabel>
                            <InputGroup size='md'>
                                <Input
                                    pr='4.5rem'
                                    borderColor={'teal.200'}
                                    _hover={{ borderColor: 'teal.300' }}
                                    focusBorderColor='teal.500'
                                    maxLength={32}
                                    onChange={(event) => {
                                        handleGroupNameChange(event);
                                    }}
                                    placeholder='Bsp.: Wohnzimmer, Lichter, ...'
                                    type='text'
                                />
                            </InputGroup>
                            {!groupNameValid && (
                                <FormErrorMessage>
                                    {groupNameInUse
                                        ? 'Gruppenname bereits vergeben'
                                        : 'Gruppenname muss zwischen 1 und 32 Zeichen lang sein'}
                                </FormErrorMessage>
                            )}
                        </FormControl>
                        <br />
                        <br />
                        <FormControl>
                            <FormLabel>
                                Auswahl der Clients für die Gruppe
                            </FormLabel>
                            <MultiSelect
                                items={preparedAssignedUserClients}
                                onSelect={(items) => {
                                    setSelectedClientIDs(
                                        items.map((item) => item.value)
                                    );
                                }}
                                colorScheme={'teal'}
                                placeHolder={'Klicken zum auswählen'}
                            ></MultiSelect>
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            colorScheme='teal'
                            isDisabled={!groupNameValid}
                            onClick={() => {
                                addGroup();
                            }}
                        >
                            Hinzufügen
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default AddGroupDialog;
