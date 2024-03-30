
/**
 * Diese Datei enthält den Code für die Benutzerverwaltung-Seite.
 * @module pages/userAdministration
 */

import React, { useState, useEffect } from 'react';
import {
    Heading,
    Grid,
    GridItem,
    CloseButton,
    Button,
    ButtonGroup,
    useToast,
    Box,
    HStack,
    VStack,
    StackDivider,
    IconButton,
    Flex,
    Spacer,
    Center,
} from '@chakra-ui/react';
import { env } from '../utils/env';
import { encryptString, decryptString } from '../utils/encryptionUtils';
import { DeleteIcon, EditIcon, AddIcon } from '@chakra-ui/icons';
import { Avatar } from '@chakra-ui/avatar';
import ValidateActionModal from '../components/validateActionModal';
import AddUserModal from '../components/addUserModal';
import ClientUserAssignmentModal from '../components/clientUserAsssignmentModal';
import { FaMicrochip } from 'react-icons/fa6';
import { ImSection } from 'react-icons/im';
import UserRightSettingsModal from '../components/userRightSettingsModal';
import AccountSettingsModal from '../components/accountSettingsModal';

/**
 * Testdaten für Benutzerrechte.
 * @type {Array}
 */
var userRightsTest = [
    {
        mayChangeUserSettings: 0,
        mayDeleteUser: 0,
        mayAssignController: 0,
        mayChangeUserType: 0,
        mayChangeUserRights: 0,

        mayAddUser: 0,
        mayChangeAccountSettings: 0,

        mayChangeOwnUserSettings: 0,
        mayDeleteSelf: 0,

        mayEditControllers: 0,
        mayDeleteControllers: 0,
    },
];

/**
 * Header-Komponente für die Benutzerverwaltung-Seite.
 * @component
 */
function Header() {
    /**
     * Gibt die Anzahl der vorherigen Seiten im Verlauf zurück.
     * @type {number}
     */
    const siteBefore = window.history.length - 1;

    return (
        <header>
            <Box
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <h1>Benutzerverwaltung</h1>
                <CloseButton
                    onClick={() => {
                        sessionStorage.setItem(
                            'userAuthorized',
                            encryptString('false')
                        );
                        window.history.go(siteBefore - window.history.length);
                    }}
                />
            </Box>
        </header>
    );
}

/**
 * Komponente für eine einzelne Einstellungszeile eines Benutzers.
 * @component
 * @param {Object} props - Die Eigenschaften der Komponente.
 * @param {boolean} props.editRights - Gibt an, ob der Benutzer Berechtigungen bearbeiten darf.
 * @param {Object} props.user - Die Benutzerdaten.
 * @param {Function} props.refresh - Funktion zum Aktualisieren der Benutzerdaten.
 * @param {Function} props.openValidateModal - Funktion zum Öffnen des Validierungsmodals.
 * @returns {JSX.Element} - Die Benutzereinstellungszeile.
 */
function UserCol(props) {
    const editRights = props.editRights;
    const [isAdmin, setIsAdmin] = useState(
        props.user.role === 'admin' || props.user.role === 'superuser'
    );
    const [userModuleModal, setUserModuleModal] = useState(false);
    const [userRightModal, setUserRightModal] = useState(false);

    const toast = useToast();

    /**
     * Funktion zum Löschen eines Benutzers.
     * @param {number} userId - Die ID des zu löschenden Benutzers.
     * @param {number} executingUserId - Die ID des ausführenden Benutzers.
     * @param {number} accountId - Die ID des Kontos.
     */
    function deleteUser(userId, executingUserId, accountId) {
        if (
            decryptString(sessionStorage.getItem('userAuthorized')) === 'false'
        ) {
            return;
        }
        let deletePath = env()['api-path'] + 'user/deleteUser';

        let data = {
            userId: userId,
            executingUserId: executingUserId,
            accountId: accountId,
        };

        let requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };

        fetch(deletePath, requestOptions)
            .then((response) => {
                if (response.status >= 400) {
                    toast({
                        title: 'Löschen fehlgeschlagen',
                        description:
                            'Das Löschen von ' +
                            props.user.username +
                            ' ist fehlgeschlagen',
                        status: 'error',
                        duration: 7000,
                        isClosable: true,
                    });
                } else {
                    toast({
                        title:
                            'Löschen von ' +
                            props.user.username +
                            ' erfolgreich',
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                    });
                    props.refresh();
                }
            })
            .catch((error) => {
                toast({
                    title: 'Löschen fehlgeschlagen',
                    status: 'error',
                    duration: 7000,
                    isClosable: true,
                });
            });
    }

    /**
     * Funktion zum Öffnen des Validierungsmodals für das Löschen eines Benutzers.
     */
    const deleteUserModal = () => {
        props.openValidateModal(
            props.user.username + ' löschen?',
            'Sind Sie sich sicher, dass Sie ' +
                props.user.username +
                ' löschen möchten? Diese Veränderung kann nicht mehr rückgängig gemacht werden!',
            () => {
                deleteUser(props.user.id, decryptString(sessionStorage.getItem('executingUserID')), decryptString(sessionStorage.getItem('accountID')));
            }
        );
    };

    /**
     * Funktion zum Ändern des Adminstatus eines Benutzers.
     * @param {number} userID - Die ID des Benutzers.
     * @param {boolean} admin - Gibt an, ob der Benutzer ein Administrator sein soll.
     */
    const updateAdminStatus = (userID, admin) => {
        let url = env()['api-path'] + 'user/changeRole';
        let adminData = 'user';
        if (admin) {
            adminData = 'admin';
        }
        let data = {
            userId: userID,
            role: adminData,
            executingUserId: decryptString(
                sessionStorage.getItem('executingUserID')
            ),
        };
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (response.status === 204) {
                    toast({
                        title: 'Erfolgreich',
                        description:
                            'Der Adminstatus von ' +
                            props.user.username +
                            ' wurde erfolgreich geändert',
                        status: 'success',
                        isClosable: true,
                        duration: 5000,
                    });
                    setIsAdmin(admin);
                    props.refresh();
                } else {
                    toast({
                        title: 'Fehler',
                        description:
                            'Während der Verarbeitung ist ein Fehler aufgetreten, versuchen Sie es erneut',
                        status: 'error',
                        isClosable: true,
                        duration: 7000,
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
                    duration: 7000,
                });
            });
    };

    /**
     * Funktion zum Ändern des Adminstatus eines Benutzers.
     */
    const handleAdminSwitch = () => {
        if (isAdmin) {
            props.openValidateModal(
                'Adminstatus von ' + props.user.username + ' ändern?',
                'Sind Sie sich sicher, dass Sie ' +
                    props.user.username +
                    ' zu einem Standardbenutzer degradieren möchten?',
                () => {
                    updateAdminStatus(props.user.id, false);
                }
            );
        } else {
            props.openValidateModal(
                'Adminstatus von ' + props.user.username + ' ändern?',
                'Sind Sie sich sicher, dass Sie ' +
                    props.user.username +
                    ' zu einem Administrator ernennen möchten?',
                () => {
                    updateAdminStatus(props.user.id, true);
                }
            );
        }
    };

    /**
     * Funktion zum Öffnen der Benutzereinstellungen.
     * @param {number} id - Die ID des Benutzers.
     */
    const handleUserSettingClick = (id) => {
        sessionStorage.setItem('userToEdit', encryptString(id.toString()));
        window.location.href = '/settings';
    };

    return (
        <Flex
            align='center'
            gap='2'
            minW='max-content'
        >
            <HStack p='2'>
                <Avatar
                    size='sm'
                    name={props.user.username}
                    src={
                        env()['user-profile-images-path'] +
                        props.user.userImageName
                    }
                />
                <Heading size='sm'>{'  ' + props.user.username}</Heading>
            </HStack>
            <Spacer />
            <Box>
                <ButtonGroup
                    gap='2'
                    variant='outline'
                >
                    <Button
                        colorScheme='teal'
                        isDisabled={
                            !editRights['mayChangeUserType'] ||
                            props.user.role === 'superuser'
                        }
                        onClick={() => {
                            handleAdminSwitch();
                        }}
                        variant={isAdmin ? 'solid' : 'outline'}
                    >
                        Admin
                    </Button>

                    <IconButton
                        colorScheme='teal'
                        icon={<EditIcon />}
                        isDisabled={
                            !editRights['mayChangeUserSettings'] ||
                            props.user.role === 'superuser'
                        }
                        onClick={() => {
                            handleUserSettingClick(props.user.id);
                        }}
                        variant='solid'
                    ></IconButton>
                    <IconButton
                        id='deleteUserButton'
                        colorScheme='teal'
                        icon={<DeleteIcon />}
                        isDisabled={
                            !editRights['mayDeleteUser'] ||
                            props.user.role === 'superuser'
                        }
                        onClick={() => {
                            deleteUserModal();
                        }}
                        variant='solid'
                    ></IconButton>
                    <IconButton
                        colorScheme='teal'
                        icon={<FaMicrochip />}
                        isDisabled={
                            !editRights['mayAssignController'] ||
                            props.user.role === 'superuser'
                        }
                        onClick={() => setUserModuleModal(true)}
                        variant='solid'
                    ></IconButton>
                    <IconButton
                        colorScheme='teal'
                        icon={<ImSection />}
                        isDisabled={
                            !editRights['mayChangeUserRights'] ||
                            props.user.role === 'superuser'
                        }
                        onClick={() => setUserRightModal(true)}
                        variant='solid'
                    ></IconButton>

                    <UserRightSettingsModal
                        openModal={userRightModal}
                        closeModal={() => setUserRightModal(false)}
                        userID={props.user.id.toString()}
                        userRole={props.user.role}
                        userName={props.user.username}
                    />
                    <ClientUserAssignmentModal
                        openModal={userModuleModal}
                        closeModal={() => setUserModuleModal(false)}
                        userID={props.user.id}
                        userName={props.user.username}
                    />
                </ButtonGroup>
            </Box>
        </Flex>
    );
}

/**
 * Benutzerverwaltungsseite.
 * @component
 * 
 * @returns {JSX.Element} - Die Benutzerverwaltungsseite.
 * @requires chakra-ui/react
 * @requires react
 * @requires components/header
 * @requires components/userCol
 * @requires components/addUserModal
 * @requires components/accountSettingsModal
 * @requires utils/env
 * @requires utils/encryptionUtils
 * @requires utils/validateActionModal
 * @requires utils/userRightsTest
 * @requires utils/fetchUsers
 * 
 */
function UserAdministration() {
    const accountID = decryptString(sessionStorage.getItem('accountID'));
    const [addUserModal, setAddUserModal] = useState(false);
    const [accountSettingModal, setAccountSettingModal] = useState(false);
    const [editRights, setEditRights] = useState(userRightsTest[0]);

    //Funktion zum Öffnen der Benutzereinstellungen
    const handleUserSettingClick = () => {
        sessionStorage.setItem(
            'userToEdit',
            sessionStorage.getItem('executingUserID')
        );
        window.location.href = '/settings';
    };

    //Funktion zum Aktualisieren der Benutzerliste
    const triggerRefresh = () => {
        fetchUsers(accountID);
    };

    const toast = useToast();
    const [users, setUsers] = useState(null);
    useEffect(() => {
        fetchUsers(accountID);
        //eslint-disable-next-line
    }, [accountID]); //Variablen die es auslösen

    const [validationModal, setValidationModal] = useState();
    const [validationModalText, setValidationModalText] = useState();
    const [validationModalTitle, setValidationModalTitle] = useState();
    const [validationModalAction, setValidationModalAction] = useState(() => {
        return () => {};
    });

    //Funktion zum Öffnen des Validierungsfensters
    function openValidationModal(
        validationModalTitle,
        validationModalText,
        pvalidationModalAction
    ) {
        setValidationModalTitle(validationModalTitle);
        setValidationModalText(validationModalText);
        setValidationModalAction(() => {
            return pvalidationModalAction;
        });
        setValidationModal(true);
    }

    //Funktion zum Abrufen der Benutzer
    function fetchUsers(accountID) {
        //fetch users from backend
        const fetchPath = env()['api-path'] + 'getUsers/' + accountID;
        fetch(fetchPath, { method: 'GET' })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setUsers(data['user']);
                if (data['user'][0] == null) {
                    console.log('Kein Benutzer vorhanden');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                toast({
                    title: 'error',
                    status: 'error',
                    isClosable: true,
                });
            });
    }

    //Funktion zum Abrufen der Benutzerrechte
    const getUserRights = async () => {
        let executingUserID = decryptString(
            sessionStorage.getItem('executingUserID')
        );

        if (executingUserID != null) {
            let url =
                env()['api-path'] +
                'getUserRights/' +
                executingUserID +
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
                        setEditRights(data);
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
                        duration: 7000,
                    });
                });
        }
    };
    // eslint-disable-next-line
    useEffect(() => {
        getUserRights();
    }, []);

    return (
        <>
            <Grid
                gap='1'
                templateRows={'50px 1fr 30px'}
                templateColumns={'150px 1fr'}
                templateAreas={`"header header" "main main"`}
                h=''
                color='blackAlpha.700'
                fontWeight='bold'
            >
                {/* Header*/}

                <GridItem
                    area={'header'}
                    pl='2'
                >
                    <Header />
                </GridItem>

                {/* Main*/}

                <GridItem area={'main'}>
                    <VStack
                        align='stretch'
                        divider={<StackDivider borderColor='gray.200' />}
                        spacing={4}
                    >
                        {users && users[0] && (
                            <>
                                {Object.keys(users).map((key, index) => (
                                    <Center
                                        key={index}
                                        w={'100%'}
                                    >
                                        <Box
                                            w={'95%'}
                                            mt={1}
                                            mb={2}
                                            p={2}
                                            bg={'teal.50'}
                                            borderRadius={'xl'}
                                        >
                                            <UserCol
                                                openValidateModal={(
                                                    a,
                                                    b,
                                                    c
                                                ) => {
                                                    openValidationModal(
                                                        a,
                                                        b,
                                                        c
                                                    );
                                                }}
                                                user={users[key]}
                                                editRights={editRights}
                                                refresh={() => {
                                                    triggerRefresh();
                                                }}
                                            />
                                        </Box>
                                    </Center>
                                ))}
                            </>
                        )}
                    </VStack>
                </GridItem>
            </Grid>
            <Box m='2'>
                <Button
                    m='1'
                    colorScheme='teal'
                    isDisabled={!editRights['mayAddUser']}
                    onClick={() => {
                        setAddUserModal(true);
                    }}
                    rightIcon={<AddIcon />}
                >
                    Benutzer hinzufügen
                </Button>
                <Button
                    m='1'
                    colorScheme='teal'
                    isDisabled={!editRights['mayChangeAccountSettings']}
                    onClick={() => {
                        setAccountSettingModal(true);
                    }}
                >
                    Kontoeinstellungen
                </Button>
                <Button
                    m='1'
                    colorScheme='teal'
                    isDisabled={!editRights['mayChangeOwnUserSettings']}
                    onClick={() => {
                        handleUserSettingClick();
                    }}
                >
                    Eigene Benutzereinstellungen öffnen
                </Button>
            </Box>
            <AccountSettingsModal
                openModal={accountSettingModal}
                closeModal={() => {
                    setAccountSettingModal(false);
                }}
            />
            <AddUserModal
                openModal={addUserModal}
                closeModal={() => {
                    setAddUserModal(false);
                    triggerRefresh();
                }}
                accountID={decryptString(sessionStorage.getItem('accountID'))}
            />

            <ValidateActionModal
                openModal={validationModal}
                closeModal={() => {
                    setValidationModal(false);
                }}
                title={validationModalTitle}
                content={validationModalText}
                execute={() => {
                    validationModalAction();
                }}
            />
        </>
    );
}
export { UserCol, Header, UserAdministration };
export default UserAdministration;
