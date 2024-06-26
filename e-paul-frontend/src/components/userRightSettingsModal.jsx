
/**
 * Komponente für das Benutzerrechte-Einstellungsmodal.
 * 
 * @component
 * @param {Object} props - Die Eigenschaften der Komponente.
 * @param {boolean} props.openModal - Gibt an, ob das Modal geöffnet ist oder nicht.
 * @param {string} props.userID - Die ID des Benutzers, dessen Benutzerrechte bearbeitet werden sollen.
 * @param {string} props.userName - Der Name des Benutzers, dessen Benutzerrechte bearbeitet werden sollen.
 * @param {string} props.userRole - Die Rolle des Benutzers, dessen Benutzerrechte bearbeitet werden sollen.
 * @param {function} props.closeModal - Eine Funktion zum Schließen des Modals.
 * @returns {JSX.Element} Das Benutzerrechte-Einstellungsmodal.
 * @requires chakra-ui/react, react, ../utils/encryptionUtils, ../utils/env
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
    useToast,
    Heading,
    Center,
    Flex,
    Text,
    Spacer,
    Box,
} from '@chakra-ui/react';
import React from 'react';
import { decryptString } from '../utils/encryptionUtils';
import { env } from '../utils/env';

//Column for the user rights
const UserRightColumn = (props) => {
    return (
        <>
            <Center>
                <Flex
                    w={'100%'}
                    m={1}
                    p={2}
                    bg={'teal.20'}
                    borderRadius={'lg'}
                >
                    <Center w={'67%'}>
                        <Text
                            w={'100%'}
                            textAlign={'left'}
                        >
                            {props.text}
                        </Text>
                    </Center>
                    <Spacer />
                    <Center w={'30%'}>
                        <Button
                            w={'100%'}
                            colorScheme='teal'
                            isDisabled={props.muted}
                            onClick={() => {
                                props.onChangeRequest(
                                    props.value.toString() === '0' ? 1 : 0
                                );
                            }}
                            variant={
                                props.value.toString() === '0'
                                    ? 'outline'
                                    : 'solid'
                            }
                        >
                            {props.value.toString() === '0'
                                ? 'Verweigert'
                                : 'Erteilt'}
                        </Button>
                    </Center>
                </Flex>
            </Center>
        </>
    );
};

//Modal für die Benutzerrechte
const UserRightSettingsModal = (props) => {
    const toast = useToast();
    const [userRights, setUserRights] = React.useState([]);
    const [ownUserRights, setOwnUserRights] = React.useState([]);
    const [updateFlag, setUpdateFlag] = React.useState(false);
    const updateModal = () => setUpdateFlag(!updateFlag);

    //Holt die Benutzerrechte von einem Benutzer
    const getUserRights = async (userID) => {
        let executingUserID = decryptString(
            sessionStorage.getItem('executingUserID')
        );

        if (userID != null && executingUserID != null) {
            let url =
                env()['api-path'] +
                'getUserRights/' +
                userID +
                '/' +
                executingUserID;
            await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => {
                    if (response.status === 200) {
                        return response.json();
                    } else if (response.status === 403) {
                        toast({
                            title: 'Nicht berechtigt',
                            description:
                                'Sie sind nicht berechtigt, die Benutzerrechte dieses Benutzers zu bearbeiten',
                            status: 'error',
                            isClosable: true,
                            duration: 5000,
                        });
                        return null;
                    }
                    toast({
                        title: 'Fehler',
                        description:
                            'Während der Verarbeitung ist ein Fehler aufgetreten, versuchen Sie es erneut',
                        status: 'error',
                        isClosable: true,
                        duration: 5000,
                    });
                    return null;
                })
                .then((data) => {
                    if (data != null) {
                        if (userID.toString() === executingUserID.toString()) {
                            setOwnUserRights(data);
                        } else {
                            setUserRights(data);
                        }
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                    toast({
                        title: 'Fehler',
                        description:
                            'Während der Verarbeitung ist ein Fehler aufgetreten, versuchen Sie es erneut',
                        status: 'error',
                        isClosable: true,
                        duration: 5000,
                    });
                });
        }
    };

    //Setzt ein Benutzerrecht eines Benutzers
    const setUserRight = async (userID, userRightKey, value) => {
        let executingUserID = decryptString(
            sessionStorage.getItem('executingUserID')
        );
        if (userID != null && executingUserID != null) {
            let url = env()['api-path'] + 'settings/rights';
            let data = {
                userRightKey: userRightKey,
                value: value,
                userId: userID,
                executingUserId: executingUserID,
            };
            await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
                .then((response) => {
                    if (response.status === 202) {
                        toast({
                            title: 'Erfolgreich geändert',
                            description:
                                'Die Benutzerrechte wurden erfolgreich geändert',
                            status: 'success',
                            isClosable: true,
                            duration: 1000,
                        });
                    } else if (response.status === 403) {
                        toast({
                            title: 'Nicht berechtigt',
                            description:
                                'Sie sind nicht berechtigt, dieses Benutzerrecht dieses Benutzers zu bearbeiten',
                            status: 'error',
                            isClosable: true,
                            duration: 5000,
                        });
                    } else {
                        toast({
                            title: 'Fehler',
                            description:
                                'Während der Verarbeitung ist ein Fehler aufgetreten, versuchen Sie es erneut',
                            status: 'error',
                            isClosable: true,
                            duration: 5000,
                        });
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                    toast({
                        title: 'Fehler',
                        description:
                            'Während der Verarbeitung ist ein Fehler aufgetreten, versuchen Sie es erneut',
                        status: 'error',
                        isClosable: true,
                        duration: 5000,
                    });
                });
        }
    };

    //Aktualisiert ein Benutzerrecht
    const updateUserRight = async (userID, userRightKey, value) => {
        await setUserRight(userID, userRightKey, value);
        await getUserRights(userID);
        updateModal();
    };

    //Lädt die Benutzerrechte neu
    const reloadModal = async (userID) => {
        await getUserRights(
            decryptString(sessionStorage.getItem('executingUserID'))
        );
        await getUserRights(userID);
        updateModal();
    };

    //Lädt die Benutzerrechte beim Start oder öffnen des Modals
    React.useEffect(() => {
        if (props.openModal) {
            reloadModal(props.userID);
        }
        // eslint-disable-next-line
    }, [props.openModal, props.userID]);

    const initialRef = React.useRef();
    return (
        <>
            <Modal
                initialFocusRef={initialRef}
                isOpen={props.openModal}
                onClose={props.closeModal}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        Benutzerberechtigungen{' '}
                        {props.userName ? <>von {props.userName}</> : null}
                    </ModalHeader>
                    <ModalCloseButton />
                    {userRights != null &&
                    ownUserRights != null &&
                    Object.keys(userRights).length > 0 &&
                    Object.keys(ownUserRights).length > 0 ? (
                        <ModalBody>
                            {props.userID.toString() !==
                            decryptString(
                                sessionStorage.getItem('executingUserID')
                            ) ? (
                                <>
                                    {ownUserRights['mayChangeUserRights'] ===
                                    1 ? (
                                        <>
                                            {props.userRole !== 'superuser' ? (
                                                <Box
                                                    w={'100%'}
                                                    m={1}
                                                    mb={2}
                                                    p={2}
                                                    bg={'teal.50'}
                                                    borderRadius={'xl'}
                                                >
                                                    <Heading
                                                        mb={2}
                                                        size='sm'
                                                    >
                                                        Für eigenes Profil
                                                        Bearbeiten
                                                    </Heading>
                                                    <UserRightColumn
                                                        muted={
                                                            ownUserRights[
                                                                'mayChangeOwnUserSettings'
                                                            ] === 0
                                                        }
                                                        update={updateFlag}
                                                        text='Kann Profileinstellung des eigenen Profils Bearbeiten'
                                                        value={
                                                            userRights[
                                                                'mayChangeOwnUserSettings'
                                                            ]
                                                        }
                                                        onChangeRequest={(
                                                            newValue
                                                        ) => {
                                                            updateUserRight(
                                                                props.userID,
                                                                'mayChangeOwnUserSettings',
                                                                newValue
                                                            );
                                                        }}
                                                    />
                                                    <UserRightColumn
                                                        muted={
                                                            ownUserRights[
                                                                'mayDeleteSelf'
                                                            ] === 0
                                                        }
                                                        update={updateFlag}
                                                        text='Kann eigenes Profil löschen'
                                                        value={
                                                            userRights[
                                                                'mayDeleteSelf'
                                                            ]
                                                        }
                                                        onChangeRequest={(
                                                            newValue
                                                        ) => {
                                                            updateUserRight(
                                                                props.userID,
                                                                'mayDeleteSelf',
                                                                newValue
                                                            );
                                                        }}
                                                    />
                                                </Box>
                                            ) : (
                                                <Box
                                                    w={'100%'}
                                                    m={1}
                                                    mb={2}
                                                    p={2}
                                                    bg={'teal.50'}
                                                    borderRadius={'xl'}
                                                >
                                                    <Heading
                                                        mb={2}
                                                        size='sm'
                                                    >
                                                        Die Rechte des
                                                        Super-Benutzers können
                                                        nicht bearbeitet werden
                                                    </Heading>
                                                </Box>
                                            )}
                                            {props.userRole === 'admin' ? (
                                                <>
                                                    <Box
                                                        w={'100%'}
                                                        m={1}
                                                        mb={2}
                                                        p={2}
                                                        bg={'teal.50'}
                                                        borderRadius={'xl'}
                                                    >
                                                        <Heading
                                                            mb={2}
                                                            size='sm'
                                                        >
                                                            Für andere Profile
                                                            Bearbeiten
                                                        </Heading>
                                                        <UserRightColumn
                                                            muted={
                                                                ownUserRights[
                                                                    'mayChangeUserSettings'
                                                                ] === 0
                                                            }
                                                            update={updateFlag}
                                                            text='Kann Profileinstellung anderer Profile Bearbeiten'
                                                            value={
                                                                userRights[
                                                                    'mayChangeUserSettings'
                                                                ]
                                                            }
                                                            onChangeRequest={(
                                                                newValue
                                                            ) => {
                                                                updateUserRight(
                                                                    props.userID,
                                                                    'mayChangeUserSettings',
                                                                    newValue
                                                                );
                                                            }}
                                                        />
                                                        <UserRightColumn
                                                            muted={
                                                                ownUserRights[
                                                                    'mayDeleteUser'
                                                                ] === 0
                                                            }
                                                            update={updateFlag}
                                                            text='Kann Benutzer löschen'
                                                            value={
                                                                userRights[
                                                                    'mayDeleteUser'
                                                                ]
                                                            }
                                                            onChangeRequest={(
                                                                newValue
                                                            ) => {
                                                                updateUserRight(
                                                                    props.userID,
                                                                    'mayDeleteUser',
                                                                    newValue
                                                                );
                                                            }}
                                                        />
                                                        <UserRightColumn
                                                            muted={
                                                                ownUserRights[
                                                                    'mayAssignController'
                                                                ] === 0
                                                            }
                                                            update={updateFlag}
                                                            text='Kann Controller zuweisen'
                                                            value={
                                                                userRights[
                                                                    'mayAssignController'
                                                                ]
                                                            }
                                                            onChangeRequest={(
                                                                newValue
                                                            ) => {
                                                                updateUserRight(
                                                                    props.userID,
                                                                    'mayAssignController',
                                                                    newValue
                                                                );
                                                            }}
                                                        />
                                                        <UserRightColumn
                                                            muted={
                                                                ownUserRights[
                                                                    'mayChangeUserType'
                                                                ] === 0
                                                            }
                                                            update={updateFlag}
                                                            text='Kann Adminstatus ändern'
                                                            value={
                                                                userRights[
                                                                    'mayChangeUserType'
                                                                ]
                                                            }
                                                            onChangeRequest={(
                                                                newValue
                                                            ) => {
                                                                updateUserRight(
                                                                    props.userID,
                                                                    'mayChangeUserType',
                                                                    newValue
                                                                );
                                                            }}
                                                        />
                                                        <UserRightColumn
                                                            muted={
                                                                ownUserRights[
                                                                    'mayChangeUserRights'
                                                                ] === 0
                                                            }
                                                            update={updateFlag}
                                                            text='Kann Benutzerrechte ändern'
                                                            value={
                                                                userRights[
                                                                    'mayChangeUserRights'
                                                                ]
                                                            }
                                                            onChangeRequest={(
                                                                newValue
                                                            ) => {
                                                                updateUserRight(
                                                                    props.userID,
                                                                    'mayChangeUserRights',
                                                                    newValue
                                                                );
                                                            }}
                                                        />
                                                    </Box>
                                                    <Box
                                                        w={'100%'}
                                                        m={1}
                                                        mb={2}
                                                        p={2}
                                                        bg={'teal.50'}
                                                        borderRadius={'xl'}
                                                    >
                                                        <Heading
                                                            mb={2}
                                                            size='sm'
                                                        >
                                                            Für Controller
                                                            Bearbeiten
                                                        </Heading>
                                                        <UserRightColumn
                                                            muted={
                                                                ownUserRights[
                                                                    'mayEditControllers'
                                                                ] === 0
                                                            }
                                                            update={updateFlag}
                                                            text='Kann Controller bearbeiten'
                                                            value={
                                                                userRights[
                                                                    'mayEditControllers'
                                                                ]
                                                            }
                                                            onChangeRequest={(
                                                                newValue
                                                            ) => {
                                                                updateUserRight(
                                                                    props.userID,
                                                                    'mayEditControllers',
                                                                    newValue
                                                                );
                                                            }}
                                                        />
                                                        <UserRightColumn
                                                            muted={
                                                                ownUserRights[
                                                                    'mayDeleteControllers'
                                                                ] === 0
                                                            }
                                                            update={updateFlag}
                                                            text='Kann Controller löschen'
                                                            value={
                                                                userRights[
                                                                    'mayDeleteControllers'
                                                                ]
                                                            }
                                                            onChangeRequest={(
                                                                newValue
                                                            ) => {
                                                                updateUserRight(
                                                                    props.userID,
                                                                    'mayDeleteControllers',
                                                                    newValue
                                                                );
                                                            }}
                                                        />
                                                    </Box>
                                                    <Box
                                                        w={'100%'}
                                                        m={1}
                                                        mb={2}
                                                        p={2}
                                                        bg={'teal.50'}
                                                        borderRadius={'xl'}
                                                    >
                                                        <Heading
                                                            mb={2}
                                                            size='sm'
                                                        >
                                                            Benutzerverwaltung
                                                            allgemein
                                                        </Heading>
                                                        <UserRightColumn
                                                            muted={
                                                                ownUserRights[
                                                                    'mayAddUser'
                                                                ] === 0
                                                            }
                                                            update={updateFlag}
                                                            text='Kann Benutzer hinzufügen'
                                                            value={
                                                                userRights[
                                                                    'mayAddUser'
                                                                ]
                                                            }
                                                            onChangeRequest={(
                                                                newValue
                                                            ) => {
                                                                updateUserRight(
                                                                    props.userID,
                                                                    'mayAddUser',
                                                                    newValue
                                                                );
                                                            }}
                                                        />
                                                        <UserRightColumn
                                                            muted={
                                                                ownUserRights[
                                                                    'mayChangeAccountSettings'
                                                                ] === 0
                                                            }
                                                            update={updateFlag}
                                                            text='Kann Accounteinstellungen bearbeiten'
                                                            value={
                                                                userRights[
                                                                    'mayChangeAccountSettings'
                                                                ]
                                                            }
                                                            onChangeRequest={(
                                                                newValue
                                                            ) => {
                                                                updateUserRight(
                                                                    props.userID,
                                                                    'mayChangeAccountSettings',
                                                                    newValue
                                                                );
                                                            }}
                                                        />
                                                    </Box>
                                                </>
                                            ) : null}
                                        </>
                                    ) : (
                                        <Box
                                            w={'100%'}
                                            m={1}
                                            mb={2}
                                            p={2}
                                            bg={'teal.50'}
                                            borderRadius={'xl'}
                                        >
                                            <Heading
                                                mb={2}
                                                size='sm'
                                            >
                                                Sie haben keine Berechtigung,
                                                Benutzerrechte zu bearbeiten
                                            </Heading>
                                        </Box>
                                    )}
                                </>
                            ) : (
                                <Box
                                    w={'100%'}
                                    m={1}
                                    mb={2}
                                    p={2}
                                    bg={'teal.50'}
                                    borderRadius={'xl'}
                                >
                                    <Heading
                                        mb={2}
                                        size='sm'
                                    >
                                        Die eigenen Rechte können nicht
                                        bearbeitet werden
                                    </Heading>
                                </Box>
                            )}
                        </ModalBody>
                    ) : (
                        <ModalBody>
                            <Heading size='xs'>
                                Warten auf Benutzerrechte...
                            </Heading>
                        </ModalBody>
                    )}
                    <ModalFooter>
                        <Button
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

export default UserRightSettingsModal;
