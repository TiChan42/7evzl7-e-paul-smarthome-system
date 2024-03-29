import React, { Component, useState, useEffect } from 'react';
import { Box, Text, Center, Spinner, Wrap, WrapItem } from '@chakra-ui/react';
import { Avatar } from '@chakra-ui/avatar';
import { encryptString, decryptString } from '../utils/encryptionUtils';
import UserPinRequestModal from '../components/userPinRequestModal';
import AddUserModal from '../components/addUserModal';
import { env } from '../utils/env';

//Komponente für die Auswahl des Benutzers
function Users() {
    //Auf die Startseite wenn nicht angemeldet
    useEffect(() => {
        if (sessionStorage.getItem('accountID') == null) {
            window.location.href = '/';
        }
    }, []);

    //Benutzerliste
    const [users, setUsers] = useState(null);

    //Referenzen auf die Pin-Modals Array
    const [pinModals, setPinModals] = useState([
        false,
        false,
        false,
        false,
        false,
        false,
        false,
    ]);
    const [userAdministrationPinModal, setUserAdministrationPinModal] =
        useState(false);
    const accountID = decryptString(sessionStorage.getItem('accountID'));

    //openModal for Create new User
    const [createUserModal, setCreateUserModal] = useState(false);

    //fetch users from backend
    function fetchUsers(accountID) {
        //fetch users from backend
        const fetchPath = env()['api-path'] + 'getUsers/' + accountID;

        fetch(fetchPath, { method: 'GET' })
            .then((response) => {
                console.log(response); // HTTP-Response ausgeben
                return response.json();
            })
            .then((data) => {
                setUsers(data['user']);
                if (data['user'][0] == null) {
                    setCreateUserModal(true);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    //Wird beim Laden der Komponente ausgeführt
    useEffect(() => {
        sessionStorage.setItem('userAuthorized', encryptString('false'));
        fetchUsers(accountID);
    }, [accountID]);

    //Managed das Array für die Pin-Modals (öffnen)
    function openPinModal(index) {
        console.log('openPinModal: ' + index);
        const nextPinModals = pinModals.map((c, i) => {
            if (i === index) {
                return true;
            } else {
                return c;
            }
        });
        setPinModals(nextPinModals);
    }

    //Managed das Array für die Pin-Modals (schließen)
    function closePinModal(index) {
        const nextPinModals = pinModals.map((c, i) => {
            if (i === index) {
                return false;
            } else {
                return c;
            }
        });
        setPinModals(nextPinModals);
    }

    //prüft ob ein Pin benötigt wird
    const checkPinNeeded = (id, index) => {
        const fetchPath = env()['api-path'] + 'pinRequired/' + id;
        console.log(fetchPath);
        fetch(fetchPath, { method: 'GET' })
            .then((response) => {
                console.log(response); // HTTP-Response ausgeben
                return response.json();
            })
            .then((data) => {
                console.log(data['Required']);
                if (data['Required']) {
                    console.log('Pin wird benötigt: ' + id);
                    openPinModal(index);
                } else {
                    console.log('Pin wird nicht benötigt: ' + id);
                    sessionStorage.setItem(
                        'userAuthorized',
                        encryptString('true')
                    );
                    window.location.href = '/devices';
                }
            })
            .catch((error) => {
                console.log(error);
            });
        return true;
    };

    //wenn auf Benutzereinstellungen geklickt wird
    const openUserSettings = () => {
        sessionStorage.setItem('executingUserID', '');
        setUserAdministrationPinModal(true);
    };

    //wenn auf Benutzer geklickt wird
    const openUser = (id, index) => {
        const encryptedId = encryptString(id.toString());
        sessionStorage.setItem('executingUserID', encryptedId);
        checkPinNeeded(id, index);
    };

    return (
        <>
            <Wrap
                w='auto'
                maxW={{ base: '220px', md: '445px', xl: '895px' }}
                mt={'100px'}
                spacing='5px'
            >
                {users && users[0] && (
                    <React.Fragment>
                        {Object.keys(users).map((key, index) => (
                            <WrapItem
                                key={index}
                                alignItems='top'
                                w='220px'
                                h='192px'
                            >
                                <Center
                                    alignItems='top'
                                    w='220px'
                                    h='192px'
                                    color='white'
                                    bg='transparent'
                                >
                                    <Box
                                        as='button'
                                        color='black'
                                        onClick={() =>
                                            openUser(users[key].id, index)
                                        }
                                        role='group'
                                        variant='ghost'
                                    >
                                        <Center>
                                            <Avatar
                                                border='4px'
                                                borderEndColor='Teal'
                                                borderStartColor='Teal'
                                                borderTopColor='Teal'
                                                borderBottomColor='Teal'
                                                size='2xl'
                                                name={users[key].username}
                                                src={
                                                    env()[
                                                        'user-profile-images-path'
                                                    ] + users[key].userImageName
                                                }
                                                _groupHover={{
                                                    border: '8px',
                                                    borderColor: 'teal.600',
                                                }}
                                            />
                                        </Center>
                                        <Center>
                                            <Text
                                                maxW='250px'
                                                mt={2}
                                                color='black'
                                                fontSize='lg'
                                                fontWeight='bold'
                                            >
                                                {users[key].username}
                                            </Text>
                                        </Center>
                                    </Box>
                                </Center>
                                <UserPinRequestModal
                                    executeIfValid={() =>
                                        (window.location.href = '/devices')
                                    }
                                    users={users}
                                    openModal={pinModals[index]}
                                    closeModal={() => closePinModal(index)}
                                />
                            </WrapItem>
                        ))}
                        <WrapItem
                            alignItems='top'
                            w='220px'
                            h='192px'
                        >
                            <Center
                                alignItems='top'
                                w='220px'
                                h='192px'
                                color='white'
                                bg='transparent'
                            >
                                <Box
                                    as='button'
                                    color='black'
                                    onClick={() => openUserSettings()}
                                    role='group'
                                    variant='ghost'
                                >
                                    <Center>
                                        <Avatar
                                            border='4px'
                                            borderEndColor='Teal'
                                            borderStartColor='Teal'
                                            borderTopColor='Teal'
                                            borderBottomColor='Teal'
                                            size='2xl'
                                            src={
                                                env()[
                                                    'user-profile-images-path'
                                                ] + 'user_settings.png'
                                            }
                                            _groupHover={{
                                                border: '8px',
                                                borderColor: 'teal.600',
                                            }}
                                        />
                                    </Center>
                                    <Center>
                                        <Text
                                            maxW='250px'
                                            mt={2}
                                            color='black'
                                            fontSize='lg'
                                            fontWeight='bold'
                                        >
                                            Benutzerverwaltung
                                        </Text>
                                    </Center>
                                </Box>
                            </Center>
                            <UserPinRequestModal
                                openModal={userAdministrationPinModal}
                                closeModal={() =>
                                    setUserAdministrationPinModal(false)
                                }
                                executeIfValid={() =>
                                    (window.location.href =
                                        '/userAdministration')
                                }
                                users={users}
                            />
                        </WrapItem>
                    </React.Fragment>
                )}
                {!users && (
                    <WrapItem
                        w='220px'
                        h='192px'
                    >
                        <Center
                            alignItems='top'
                            display='block'
                            w='220px'
                            h='192px'
                            color='white'
                            bg='transparent'
                        >
                            <Avatar
                                border='4px'
                                borderEndColor='Teal'
                                borderStartColor='Teal'
                                borderTopColor='Teal'
                                borderBottomColor='Teal'
                                size='2xl'
                                icon={
                                    <Spinner
                                        color='Teal'
                                        size='xl'
                                    />
                                }
                            />
                            <Box>
                                <Center>
                                    <Text
                                        mt={2}
                                        color='black'
                                        fontSize='lg'
                                        fontWeight='bold'
                                        whiteSpace='pre-line'
                                    >
                                        Lade Benutzer
                                    </Text>
                                </Center>
                            </Box>
                        </Center>
                    </WrapItem>
                )}
            </Wrap>
            <AddUserModal
                openModal={createUserModal}
                closeModal={() => {
                    setCreateUserModal(false);
                    fetchUsers(accountID);
                }}
                accountID={accountID}
                disableClose
                requireAdmin
            />
        </>
    );
}

class ChooseUser extends Component {
    render() {
        return (
            <Center>
                <Users></Users>
            </Center>
        );
    }
}

export default ChooseUser;
