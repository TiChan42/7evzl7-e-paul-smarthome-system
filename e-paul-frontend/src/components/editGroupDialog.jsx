/**
 * Komponente für den Dialog zur Bearbeitung einer Gruppe.
 *
 * @component
 * @example
 * return (
 *   <EditGroupDialog />
 * )
 * @param {Object} props
 * @param {number} props.id - Die ID der Gruppe.
 * @param {string} props.name - Der Name der Gruppe.
 * @param {Function} props.updateGroup - Funktion zum Aktualisieren der Gruppen.
 * @returns {JSX.Element} Die EditGroupDialog-Komponente.
 * @exports EditGroupDialog
 * 
 * @requires chakra-ui/react
 * @requires react
 * @requires utils/encryptionUtils
 * @requires utils/env
 * @requires components/multiselect
 * @requires components/validateActionModal
 * @requires components/addSceneDialog
 * @requires components/editSceneDialog
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
    Spacer,
    Flex,
    Box,
    IconButton,
    Text,
    Tooltip,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import MultiSelect from './multiselect';
import React, { useState, useEffect } from 'react';
import { decryptString } from '../utils/encryptionUtils';
import { env } from '../utils/env';
import ValidateActionModal from './validateActionModal';
import AddSceneDialog from './addSceneDialog';
import EditSceneDialog from './editSceneDialog';


function EditGroupDialog(props) {
    const toast = useToast();

    const nameInput = React.useRef(null);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [validateDeleteGroupModal, setValidateDeleteGroupModal] =
        useState(false);

    const [groupNameInUse, setGroupNameInUse] = useState(false);
    const [groupNameValid, setGroupNameValid] = useState(true);
    const [groupNameValue, setGroupNameValue] = useState('');

    const [accountClients, setAccountClients] = useState([]);
    const [userClientIDs, setUserClientIDs] = useState([]);
    const [assignedUserClients, setAssignedUserClients] = useState([]);
    const [preparedAssignedUserClients, setPreparedAssignedUserClients] =
        useState([]);
    const [selectedClientIDs, setSelectedClientIDs] = useState([]);
    const [oldSelectedClientIDs, setOldSelectedClientIDs] = useState([]);

    const [scenes, setScenes] = useState([]);
    const [groupClients, setGroupClients] = useState([]);
    const [validateDeleteSceneModal, setValidateDeleteSceneModal] = useState(
        []
    );

    //Holt die Gruppe mit der in Props gegebenen ID
    const fetchGroup = () => {
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
                    //gets the group with the given id
                    let group = data.filter(
                        (group) =>
                            group['id'].toString() === props.id.toString()
                    )[0];
                    setOldSelectedClientIDs(group.port);
                    setSelectedClientIDs(group.port);
                    setGroupNameValue(group.name);
                    if (nameInput.current !== null)
                        nameInput.current.value = group.name;
                })
                .catch((error) => {
                    console.error('Error(fetchGroup):', error);
                });
        }
    };

    //Holt die Clients des Accounts
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
                    //setUpdateAssignedUserClients(!updateAssignedUserClients);
                })
                .catch((error) => {
                    console.error('Error(fetchAccountClients):', error);
                    setAccountClients([]);
                    //setUpdateAssignedUserClients(!updateAssignedUserClients);
                });
        }
    };

    //Holt die ClientIDs des Users
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
                    //setUpdateAssignedUserClients(!updateAssignedUserClients);
                })
                .catch((error) => {
                    console.error('Error(fetchUserClientIDs):', error);
                    setUserClientIDs([]);
                    //setUpdateAssignedUserClients(!updateAssignedUserClients);
                });
        }
    };

    //setzt die Clients, die dem User zugewiesen sind und schreibt sie in assignedUserClients
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

    //Generiert einen Namen aus der ID
    const generateNameOutOfID = (id) => {
        let temp = (id * 2345 + id * 856 + id * 71) / (id * id * id);
        //More complex function to generate a name out of the id
        temp = parseInt((temp * 2345 + temp * 856 + temp * 71) / (id * id));
        return 'Client_' + temp.toString();
    };

    //setzt die Clients, die dem User zugewiesen sind und schreibt sie in Form eines Arrays, welches name und value enthält in preparedAssignedUserClients
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

    //Prüft ob der Gruppenname bereits vergeben ist und setzt groupNameInUse und groupNameValid. Wenn der Gruppenname gültig ist, wird changeGroupname aufgerufen
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
                    if (
                        groupName.length > 0 &&
                        groupName.length <= 32 &&
                        !groupNames.includes(groupName)
                    ) {
                        changeGroupname(groupName);
                    }
                })
                .catch((error) => {
                    console.error('Error(isGroupNameInUse):', error);
                });
        }
    };

    //Ändert den Gruppennamen
    const changeGroupname = (groupName) => {
        let userID = decryptString(sessionStorage.getItem('executingUserID'));
        if (userID) {
            fetch(env()['api-path'] + 'group/changeName', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    executingUserId: userID,
                    name: groupName,
                    groupId: props.id,
                }),
            })
                .then((response) => {
                    if (response.status === 204) {
                        setGroupNameValue(groupName);
                        toast.closeAll();
                        toast({
                            title: 'Gruppename erfolgreich bearbeitet',
                            status: 'success',
                            duration: 3000,
                            isClosable: true,
                        });
                        props.updateGroup();
                    } else {
                        nameInput.current.value = groupNameValue;
                        toast.closeAll();
                        toast({
                            title: 'Fehler bei der Namensänderung der Gruppe',
                            status: 'error',
                            duration: 3000,
                            isClosable: true,
                        });
                    }
                })
                .catch((error) => {
                    console.error('Error(changeGroupname):', error);
                    toast.closeAll();
                    nameInput.current.value = groupNameValue;
                    toast({
                        title: 'Fehler bei der Namensänderung der Gruppe',
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                });
        }
    };

    //Prüft ob der Gruppenname gültig ist und setzt groupNameValid
    const handleGroupNameChange = (event) => {
        let groupName = event.target.value;
        isGroupNameInUse(groupName);
    };

    //Löscht die Gruppe
    const deleteGroup = () => {
        let userID = decryptString(sessionStorage.getItem('executingUserID'));
        if (userID) {
            fetch(env()['api-path'] + 'user/deleteGroup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userID,
                    groupId: props.id,
                }),
            })
                .then((response) => {
                    if (response.status === 204) {
                        toast({
                            title: 'Gruppe erfolgreich gelöscht',
                            status: 'success',
                            duration: 5000,
                            isClosable: true,
                        });
                        onClose();
                        props.updateGroup();
                    } else {
                        toast({
                            title: 'Fehler beim Löschen der Gruppe',
                            status: 'error',
                            duration: 7000,
                            isClosable: true,
                        });
                    }
                })
                .catch((error) => {
                    console.error('Error(deleteGroup):', error);
                    toast({
                        title: 'Fehler beim Löschen der Gruppe',
                        status: 'error',
                        duration: 7000,
                        isClosable: true,
                    });
                });
        }
    };

    //löscht einzelne Clients aus der Gruppe
    const removeClientFromGroup = (clientID) => {
        let userID = decryptString(sessionStorage.getItem('executingUserID'));
        if (userID) {
            let data = {
                userId: userID,
                executingUserId: userID,
                groupId: props.id,
                portId: clientID,
            };
            fetch(env()['api-path'] + 'group/removePort', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
                .then((response) => {
                    if (response.status === 204) {
                        toast({
                            title: 'Client erfolgreich aus der Gruppe entfernt',
                            status: 'success',
                            duration: 1000,
                            isClosable: true,
                        });
                        fetchGroup();
                    } else {
                        toast({
                            title: 'Fehler beim Entfernen des Clients aus der Gruppe',
                            status: 'error',
                            duration: 3000,
                            isClosable: true,
                        });
                    }
                })
                .catch((error) => {
                    console.error('Error(removeClientFromGroup):', error);
                    toast({
                        title: 'Fehler beim Entfernen des Clients aus der Gruppe',
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                });
        }
    };

    //fügt einzelne Clients der Gruppe hinzu
    const addClientToGroup = (clientID) => {
        let userID = decryptString(sessionStorage.getItem('executingUserID'));
        if (userID) {
            let data = {
                userId: userID,
                executingUserId: userID,
                groupId: props.id,
                portId: clientID,
            };
            fetch(env()['api-path'] + 'group/addPort', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
                .then((response) => {
                    if (response.status === 201) {
                        toast({
                            title: 'Client erfolgreich zur Gruppe hinzugefügt',
                            status: 'success',
                            duration: 1000,
                            isClosable: true,
                        });
                        fetchGroup();
                    } else {
                        toast({
                            title: 'Fehler beim Hinzufügen des Clients zur Gruppe',
                            status: 'error',
                            duration: 3000,
                            isClosable: true,
                        });
                    }
                })
                .catch((error) => {
                    console.error('Error(addClientToGroup):', error);
                    toast({
                        title: 'Fehler beim Hinzufügen des Clients zur Gruppe',
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                });
        }
    };

    //Überprüft unterschiede zwischen selectedClientIDs und oldSelectedClientIDs und fügt oder entfernt Clients aus der Gruppe, setzt danach oldSelectedClientIDs auf selectedClientIDs
    useEffect(() => {
        let add = selectedClientIDs.filter(
            (x) => !oldSelectedClientIDs.includes(x)
        );
        let remove = oldSelectedClientIDs.filter(
            (x) => !selectedClientIDs.includes(x)
        );
        add.forEach((clientID) => {
            addClientToGroup(clientID);
        });
        remove.forEach((clientID) => {
            removeClientFromGroup(clientID);
        });
        if (selectedClientIDs !== oldSelectedClientIDs) {
            setOldSelectedClientIDs(selectedClientIDs);
        }

        //setze basierend auf den selectedClientIDs die groupClients
        let temp = [];
        if (
            accountClients &&
            selectedClientIDs &&
            accountClients[0] &&
            selectedClientIDs[0]
        ) {
            accountClients.forEach((client) => {
                if (selectedClientIDs.includes(client.id)) {
                    temp.push(client);
                }
            });
        }
        setGroupClients(temp);
        // eslint-disable-next-line
    }, [selectedClientIDs]);

    //holt alle Szenen der Gruppe
    const fetchScenes = () => {
        let userID = decryptString(sessionStorage.getItem('executingUserID'));
        if (userID) {
            fetch(env()['api-path'] + 'getScenes/' + props.id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => {
                    if (response.status === 200) {
                        return response.json();
                    } else {
                        console.error('Error(fetchScenes):', response);
                    }
                })
                .then((data) => {
                    setScenes(data);
                    let temp = [];
                    data.forEach(() => {
                        temp.push(false);
                    });
                    setValidateDeleteSceneModal(temp);
                })
                .catch((error) => {
                    console.error('Error(fetchScenes):', error);
                });
        }
    };

    //Szene löschen
    const deleteScene = (sceneID) => {
        let userID = decryptString(sessionStorage.getItem('executingUserID'));
        if (userID) {
            let data = {
                executingUserId: userID,
                sceneId: sceneID,
            };
            fetch(env()['api-path'] + 'group/scene/deleteScene', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
                .then((response) => {
                    if (response.status === 204) {
                        toast({
                            title: 'Szene erfolgreich gelöscht',
                            status: 'success',
                            duration: 1000,
                            isClosable: true,
                        });
                        fetchScenes();
                    } else {
                        toast({
                            title: 'Fehler beim Löschen der Szene',
                            status: 'error',
                            duration: 3000,
                            isClosable: true,
                        });
                    }
                })
                .catch((error) => {
                    console.error('Error(deleteScene):', error);
                    toast({
                        title: 'Fehler beim Löschen der Szene',
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                });
        }
    };

    //Szene ausführen
    const executeScene = (sceneID) => {
        let userID = decryptString(sessionStorage.getItem('executingUserID'));
        if (userID) {
            let data = {
                executingUserId: userID,
                groupId: props.id,
                sceneId: sceneID,
            };
            fetch(env()['api-path'] + 'group/scene/executeScene', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
                .then((response) => {
                    if (response.status === 204) {
                        toast({
                            title: 'Szene erfolgreich ausgeführt',
                            status: 'success',
                            duration: 1000,
                            isClosable: true,
                        });
                    } else if (response.status === 420) {
                        toast({
                            title: 'Falscher Input',
                            status: 'error',
                            duration: 3000,
                            isClosable: true,
                        });
                    } else {
                        toast({
                            title: 'Fehler beim Ausführen der Szene',
                            status: 'error',
                            duration: 3000,
                            isClosable: true,
                        });
                    }
                })
                .catch((error) => {
                    console.error('Error(executeScene):', error);
                    toast({
                        title: 'Fehler beim Ausführen der Szene',
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                });
        }
    };

    //Init nach jedem Öffnen des Dialogs
    useEffect(() => {
        fetchGroup();
        fetchScenes();
        fetchAccountClients();
        fetchUserClientIDs();
        // eslint-disable-next-line
    }, [isOpen]);

    return (
        <>
            <Tooltip
                color={'teal.100'}
                bg={'secondary.700'}
                hasArrow
                label='Öffnen der Gruppeneinstellungen und Hinzufügen von Szenen'
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
                    <EditIcon mr={2}></EditIcon>
                    Gruppe Bearbeiten
                </Button>
            </Tooltip>

            <Modal
                isOpen={isOpen}
                onClose={onClose}
                size={{ base: 'full', sm: 'md' }}
            >
                <ModalOverlay />
                <ModalContent bg={'teal.50'}>
                    <ModalHeader w={'90%'}>Gruppe bearbeiten</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl
                            isInvalid={!groupNameValid}
                            isRequired
                        >
                            <FormLabel>Name der Gruppe</FormLabel>
                            <InputGroup size='md'>
                                <Input
                                    ref={nameInput}
                                    pr='4.5rem'
                                    borderColor={'teal.200'}
                                    _hover={{ borderColor: 'teal.300' }}
                                    defaultValue={props.name}
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
                            <FormLabel>Szenen der Gruppe</FormLabel>
                            {scenes && scenes[0] ? (
                                <Box
                                    justifyContent={'space-between'}
                                    overflowY={'auto'}
                                    w={'100%'}
                                    maxH={'270px'}
                                    borderRadius={'md'}
                                    __css={{
                                        '&::-webkit-scrollbar': {
                                            backgroundColor: 'transparent',
                                            width: '3px',
                                        },
                                        '&::-webkit-scrollbar-thumb': {
                                            backgroundColor: 'teal.600',
                                            borderRadius: 'full',
                                        },
                                    }}
                                >
                                    {scenes.map((scene, index) => {
                                        return (
                                            <Box
                                                key={'Scene-' + index}
                                                w={'100%'}
                                                mb={2}
                                                p={2}
                                                bg={'teal.250'}
                                                borderRadius={'md'}
                                            >
                                                <Flex
                                                    justify={'space-between'}
                                                    w={'100%'}
                                                >
                                                    <Box
                                                        maxW={{
                                                            base: '22%',
                                                            sm: '35%',
                                                            md: '40%',
                                                        }}
                                                    >
                                                        <Text noOfLines={1}>
                                                            {scene.name}
                                                        </Text>
                                                    </Box>
                                                    <Spacer />
                                                    <IconButton
                                                        ml={2}
                                                        fontSize='lg'
                                                        aria-label='Delete'
                                                        colorScheme='red'
                                                        icon={<DeleteIcon />}
                                                        onClick={() => {
                                                            let temp = [
                                                                ...validateDeleteSceneModal,
                                                            ];
                                                            temp[index] = true;
                                                            setValidateDeleteSceneModal(
                                                                temp
                                                            );
                                                        }}
                                                        size={'md'}
                                                        variant='outline'
                                                    />
                                                    <ValidateActionModal
                                                        openModal={
                                                            validateDeleteSceneModal[
                                                                index
                                                            ]
                                                        }
                                                        closeModal={() => {
                                                            let temp = [
                                                                ...validateDeleteSceneModal,
                                                            ];
                                                            temp[index] = false;
                                                            setValidateDeleteSceneModal(
                                                                temp
                                                            );
                                                        }}
                                                        title={
                                                            'Szene ' +
                                                            scene.name +
                                                            ' Löschen?'
                                                        }
                                                        content={
                                                            'Sind Sie sicher, dass Sie die Szene "' +
                                                            scene.name +
                                                            '" löschen möchten? Die Szene wird unwiderruflich gelöscht.'
                                                        }
                                                        execute={() => {
                                                            deleteScene(
                                                                scene.id
                                                            );
                                                            fetchScenes();
                                                        }}
                                                    />

                                                    <EditSceneDialog
                                                        scene={scene}
                                                        groupName={
                                                            groupNameValue
                                                        }
                                                        groupId={props.id}
                                                        groupClients={
                                                            groupClients
                                                        }
                                                        reloadScenes={() => {
                                                            fetchScenes();
                                                        }}
                                                    />
                                                    <Button
                                                        ml={2}
                                                        colorScheme={'teal'}
                                                        onClick={() => {
                                                            executeScene(
                                                                scene.id
                                                            );
                                                        }}
                                                        variant={'outline'}
                                                    >
                                                        Ausführen
                                                    </Button>
                                                </Flex>
                                            </Box>
                                        );
                                    })}
                                </Box>
                            ) : (
                                <Box>
                                    <FormLabel color={'teal.200'}>
                                        Keine Szenen vorhanden
                                    </FormLabel>
                                </Box>
                            )}
                            <AddSceneDialog
                                groupId={props.id}
                                groupName={groupNameValue}
                                groupClients={groupClients}
                                reloadScenes={() => {
                                    fetchScenes();
                                }}
                            />
                        </FormControl>

                        <br />
                        <br />
                        <Box>
                            <FormLabel>
                                Auswahl der Clients für die Gruppe
                            </FormLabel>
                            <MultiSelect
                                items={preparedAssignedUserClients}
                                preSelectValues={oldSelectedClientIDs}
                                onSelect={(items) => {
                                    setSelectedClientIDs(
                                        items.map((item) => item.value)
                                    );
                                }}
                                colorScheme={'teal'}
                                placeHolder={'Klicken zum auswählen'}
                            ></MultiSelect>
                        </Box>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            colorScheme='red'
                            onClick={() => {
                                setValidateDeleteGroupModal(true);
                            }}
                            variant={'outline'}
                        >
                            Gruppe Löschen
                        </Button>
                        <ValidateActionModal
                            openModal={validateDeleteGroupModal}
                            closeModal={() => {
                                setValidateDeleteGroupModal(false);
                            }}
                            title={'Gruppe Löschen?'}
                            content={
                                'Sind Sie sicher, dass Sie die Gruppe löschen möchten? Die Gruppe und alle zugehörigen Daten wie Szenen werden unwiderruflich gelöscht.'
                            }
                            execute={() => {
                                deleteGroup();
                            }}
                        />
                        <Spacer />

                        <Button
                            colorScheme='teal'
                            onClick={() => {
                                onClose();
                            }}
                            variant={'ghost'}
                        >
                            Schließen
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default EditGroupDialog;
