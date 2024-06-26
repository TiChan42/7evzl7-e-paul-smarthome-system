/**
 * Komponente für das Modalfenster zur Zuweisung von Benutzern zu Clients.
 * 
 * @component
 * @example
 * return (
 *   <ClientUserAssignmentModal />
 * )
 * @param {Object} props - Die Props.
 * @param {boolean} props.openModal - Der Status, ob das Modal geöffnet ist.
 * @param {Function} props.closeModal - Die Funktion zum Schließen des Modals.
 * @param {string} props.userID - Die ID des Benutzers.
 * @param {string} props.userName - Der Name des Benutzers.
 * @returns {JSX.Element} Das Modal zur Zuweisung von Benutzern zu Clients.
 * 
 * @requires chakra-ui/react
 * @requires react
 * @requires utils/env
 * @requires utils/clientIconPaths
 */
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Tabs,
    TabList,
    Tab,
    Flex,
    Spacer,
    Box,
    Heading,
    Text,
    Avatar,
    Tag,
    TagLabel,
    Center,
    Button,
    IconButton,
    Tooltip,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { env } from '../utils/env';
import { clientIconPath } from '../utils/clientIconPaths';
import { ArrowForwardIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { decryptString, encryptString } from '../utils/encryptionUtils';

//ClientElement
const ClientElement = (props) => {
    return (
        <Tooltip
            color={'teal.10'}
            bg={'teal.650'}
            aria-label='A tooltip'
            hasArrow
            label={props.clientName}
        >
            <Tag
                borderRadius='full'
                colorScheme='teal'
                defaultValue={' '}
                size={{ base: 'sm', sm: 'md', md: 'lg' }}
            >
                {props.state ? (
                    <>
                        {!props.variant ? (
                            <Avatar
                                mr={2}
                                ml={-1}
                                textColor={'teal.900'}
                                bg={'teal.40'}
                                name={props.clientType}
                                size='sm'
                                src={clientIconPath()[props.clientType]}
                            />
                        ) : null}

                        {props.clientName.toString().length <= 10 ? (
                            <TagLabel>{props.clientName}</TagLabel>
                        ) : (
                            <TagLabel>
                                {props.clientName.toString().substring(0, 9)}...
                            </TagLabel>
                        )}

                        {props.variant ? (
                            <Avatar
                                mr={-1}
                                ml={2}
                                textColor={'teal.900'}
                                bg={'teal.40'}
                                name={props.clientType}
                                size='sm'
                                src={clientIconPath()[props.clientType]}
                            />
                        ) : null}
                    </>
                ) : (
                    <>
                        {props.clientName.toString().length <= 5 &&
                        !props.clientName.toString().includes('W') ? (
                            <>
                                <TagLabel>{props.clientName}</TagLabel>
                            </>
                        ) : (
                            <>
                                {props.clientName
                                    .toString()
                                    .substring(0, 2)
                                    .includes('W') ? (
                                    <TagLabel>
                                        {props.clientName
                                            .toString()
                                            .substring(
                                                0,
                                                Math.min(
                                                    2,
                                                    props.clientName.toString()
                                                        .length
                                                )
                                            )}
                                        ...
                                    </TagLabel>
                                ) : (
                                    <TagLabel>
                                        {props.clientName
                                            .toString()
                                            .substring(0, 3)}
                                        ...
                                    </TagLabel>
                                )}
                            </>
                        )}
                    </>
                )}
            </Tag>
        </Tooltip>
    );
};

//ClientListElement
const ClientListElement = (props) => {
    return (
        <>
            <Center>
                <Flex
                    w={'100%'}
                    h={'40px'}
                    m={1}
                    bg={'teal.100'}
                    borderRadius={'8px'}
                >
                    {props.variant && (
                        <>
                            <Center p={1}>
                                <IconButton
                                    fontSize='20px'
                                    aria-label='Call Sage'
                                    colorScheme='teal'
                                    icon={<ArrowBackIcon />}
                                    isDisabled={props.muted}
                                    onClick={() => {
                                        props.onUserIDChange();
                                    }}
                                    size='sm'
                                    variant='solid'
                                />
                            </Center>
                            <Spacer />
                        </>
                    )}
                    <Box alignSelf={'center'}>
                        <Box>
                            <ClientElement
                                clientName={props.clientName}
                                clientType={props.clientType}
                                state={props.state}
                                variant={props.variant}
                            />
                        </Box>
                    </Box>
                    {!props.variant && (
                        <>
                            <Spacer />
                            <Center p={1}>
                                <IconButton
                                    fontSize='20px'
                                    aria-label='Call Sage'
                                    colorScheme='teal'
                                    icon={<ArrowForwardIcon />}
                                    isDisabled={props.muted}
                                    onClick={() => {
                                        props.onUserIDChange();
                                    }}
                                    size='sm'
                                    variant='solid'
                                />
                            </Center>
                        </>
                    )}
                </Flex>
            </Center>
        </>
    );
};

//ClientList
const ClientList = (props) => {
    const [elementsToShow, setElementsToShow] = useState([]);
    const [largerSide, setLargerSide] = useState(false);

    // useEffect um die Elemente zu filtern
    useEffect(() => {
        if (props.variant) {
            var temp = [];
            if (
                props.clients &&
                props.userClientIDs &&
                props.clients[0] &&
                props.userClientIDs[0]
            ) {
                props.userClientIDs.forEach((id) => {
                    temp.push(props.clients.find((client) => client.id === id));
                });
            }
            setElementsToShow(temp);
        } else {
            if (
                props.clients &&
                props.userClientIDs &&
                props.clients[0] &&
                props.userClientIDs[0]
            ) {
                setElementsToShow(
                    props.clients.filter(
                        (client) => !props.userClientIDs.includes(client.id)
                    )
                );
            } else if (props.clients && props.clients[0]) {
                setElementsToShow(props.clients);
            }
        }
    }, [
        props.clients,
        props.variant,
        props.userClientIDs,
        props.triggerRender,
    ]);

    // useEffect um zu bestimmen, ob die Seite größer ist
    useEffect(() => {
        if (
            Object.keys(props.clients).length - props.userClientIDs.length >
            props.userClientIDs.length
        ) {
            setLargerSide(true);
        } else {
            setLargerSide(false);
        }
    }, [props.userClientIDs, props.clients, props.triggerRender]);

    // Funktion um einen Namen aus der ID zu generieren
    const generateNameOutOfID = (id) => {
        let temp = (id * 2345 + id * 856 + id * 71) / (id * id * id);
        //More complex function to generate a name out of the id
        temp = parseInt((temp * 2345 + temp * 856 + temp * 71) / (id * id));
        return 'Client_' + temp.toString();
    };

    return (
        <Box
            h={props.height}
            borderColor={'teal.500'}
            borderRight={largerSide && !props.variant ? '1px' : '0px'}
            borderLeft={!largerSide && props.variant ? '1px' : '0px'}
        >
            {elementsToShow && elementsToShow[0] ? (
                <>
                    {elementsToShow.map((client) => {
                        return (
                            <ClientListElement
                                muted={
                                    props.executingUserClients[0] ===
                                        undefined ||
                                    !props.executingUserClients.includes(
                                        client.id
                                    )
                                }
                                key={encryptString(client.id.toString())}
                                clientName={
                                    client.name
                                        ? client.name
                                        : generateNameOutOfID(client.id)
                                }
                                clientType={client.type}
                                state={props.state}
                                variant={props.variant}
                                onUserIDChange={() => {
                                    props.onUserIDChange(client.id);
                                }}
                            />
                        );
                    })}
                </>
            ) : null}
        </Box>
    );
};

//Modal for signing up and in
const ClientUserAssignmentModal = (props) => {
    const initialRef = React.useRef();
    const userClientsRef = React.useRef();
    const allClientsRef = React.useRef();

    const [userID, setUserID] = useState(props.userID);
    const [accountID, setAccountID] = useState(
        decryptString(sessionStorage.getItem('accountID'))
    );
    const [groupID, setGroupID] = useState();

    const [accountClients, setAccountClients] = useState([]);
    const [userClientIDs, setUserClientIDs] = useState([]);
    const [triggerRender, setTriggerRender] = useState(false);

    const fetchAccountClients = () => {
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
    };

    const fetchUserClientIDs = () => {
        fetch(env()['api-path'] + 'getGroup/Assignment/' + userID, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setGroupID(data[0].id);
                setUserClientIDs(data[1]);
            })
            .catch((error) => {
                console.error('Error(fetchUserClientIDs):', error);
                setGroupID(null);
                setUserClientIDs([]);
            });
    };

    const addClientToUser = (clientID) => {
        let executingUserID = decryptString(
            sessionStorage.getItem('executingUserID')
        );
        let data = {
            userId: userID,
            portId: clientID,
            groupId: groupID,
            executingUserId: executingUserID,
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
                    reloadClients();
                }
            })
            .catch((error) => {
                console.error('Error(addClientToUser):', error);
            });
    };

    const removeClientFromUser = (clientID) => {
        let executingUserID = decryptString(
            sessionStorage.getItem('executingUserID')
        );

        let data = {
            userId: userID,
            portId: clientID,
            groupId: groupID,
            executingUserId: executingUserID,
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
                    reloadClients();
                }
            })
            .catch((error) => {
                console.error('Error(removeClientFromUser):', error);
            });
    };

    //Initialisierung der ModalStates
    const [siteState, setSiteState] = useState(1);
    useEffect(() => {
        setSiteState(1);
    }, [props.openModal]);

    useEffect(() => {
        if (userClientsRef.current && allClientsRef.current) {
            if (siteState === 1) {
                userClientsRef.current.focus();
            } else {
                allClientsRef.current.focus();
            }
        }
    }, [siteState]);

    //Status ob der Bildschirm kleiner als 768px(md) ist
    const [displayState, setDisplayState] = useState(false);
    useEffect(() => {
        const handleResize = () => {
            // Perform actions on window resize
            if (window.innerWidth <= 768) {
                setDisplayState(true);
            } else {
                setDisplayState(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    //Beim Öffnen des Modals asynchron die Daten laden
    useEffect(() => {
        if (props.openModal) {
            reloadClients();
        }
        // eslint-disable-next-line
    }, [props.openModal]);

    const reloadClients = async () => {
        await setUserID(props.userID);
        await setAccountID(decryptString(sessionStorage.getItem('accountID')));
        await fetchUserClientIDs();
        await fetchAccountClients();

        if (accountClients && userClientIDs && groupID && userID && accountID) {
            setTriggerRender(!triggerRender);
        }
    };

    const [executingUserClients, setExecutingUserClients] = useState([]);
    const fetchExecutingUserClientIDs = () => {
        let execUserID = decryptString(
            sessionStorage.getItem('executingUserID')
        );
        if (
            execUserID !== null &&
            execUserID !== undefined &&
            execUserID !== ''
        ) {
            fetch(env()['api-path'] + 'getGroup/Assignment/' + execUserID, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    setExecutingUserClients(data[1]);
                    setTriggerRender(!triggerRender);
                })
                .catch((error) => {
                    console.error('Error(fetchUserClientIDs):', error);
                    setExecutingUserClients([]);
                    setTriggerRender(!triggerRender);
                });
        }
    };
    useEffect(() => {
        fetchExecutingUserClientIDs();
        // eslint-disable-next-line
    }, [props.openModal]);

    return (
        <>
            <Modal
                initialFocusRef={initialRef}
                isOpen={props.openModal}
                onClose={props.closeModal}
                scrollBehavior={'inside'}
                size={{ base: 'full', sm: 'md', md: '2xl' }}
            >
                <ModalOverlay />
                {accountClients &&
                userClientIDs &&
                groupID &&
                userID &&
                accountID ? (
                    <ModalContent>
                        <Tabs
                            align='start'
                            colorScheme='teal'
                            variant='enclosed'
                        >
                            <ModalHeader>
                                <TabList display={{ base: 'flex', md: 'none' }}>
                                    <Tab
                                        ref={userClientsRef}
                                        onClick={() => {
                                            setSiteState(1);
                                        }}
                                    >
                                        Alle
                                    </Tab>
                                    <Tab
                                        ref={allClientsRef}
                                        onClick={() => {
                                            setSiteState(0);
                                        }}
                                    >
                                        Zugewiesen
                                    </Tab>
                                </TabList>
                                <Heading
                                    display={{ base: 'none', md: 'flex' }}
                                    size={'md'}
                                >
                                    Weisen Sie{' '}
                                    {props.userName ? (
                                        <>{props.userName}</>
                                    ) : (
                                        <>dem Benutzer</>
                                    )}{' '}
                                    Clients zu
                                </Heading>
                            </ModalHeader>
                        </Tabs>
                        <ModalCloseButton />
                        <ModalBody>
                            <Text display={{ base: 'flex', md: 'none' }}>
                                Weisen Sie{' '}
                                {props.userName ? (
                                    <>{props.userName}</>
                                ) : (
                                    <>dem Benutzer</>
                                )}{' '}
                                Clients zu
                            </Text>
                            <Flex h={'100%'}>
                                <Box
                                    w={{
                                        base: siteState ? '70%' : '30%',
                                        md: '50%',
                                    }}
                                    h={'100%'}
                                >
                                    <Heading
                                        p={1}
                                        textAlign={'left'}
                                        onClick={() => {
                                            setSiteState(1);
                                        }}
                                        size={{ base: 'xs', sm: 'sm' }}
                                    >
                                        Alle
                                    </Heading>
                                    <ClientList
                                        clients={accountClients}
                                        userClientIDs={userClientIDs}
                                        state={displayState ? siteState : 1}
                                        variant={false}
                                        height={'100%'}
                                        onUserIDChange={(changedID) => {
                                            addClientToUser(changedID);
                                        }}
                                        triggerRender={triggerRender}
                                        executingUserClients={
                                            executingUserClients
                                        }
                                    />
                                </Box>

                                <Box
                                    w={{
                                        base: !siteState ? '70%' : '30%',
                                        md: '50%',
                                    }}
                                    h={'100%'}
                                >
                                    <Heading
                                        p={1}
                                        textAlign={'right'}
                                        onClick={() => {
                                            setSiteState(0);
                                        }}
                                        size={{ base: 'xs', sm: 'sm' }}
                                    >
                                        Zugewiesen
                                    </Heading>
                                    <ClientList
                                        clients={accountClients}
                                        userClientIDs={userClientIDs}
                                        state={displayState ? !siteState : 1}
                                        variant={true}
                                        height={'100%'}
                                        onUserIDChange={(changedID) => {
                                            removeClientFromUser(changedID);
                                        }}
                                        triggerRender={triggerRender}
                                        executingUserClients={
                                            executingUserClients
                                        }
                                    />
                                </Box>
                            </Flex>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                onClick={props.closeModal}
                                variant='outline'
                            >
                                Schließen
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                ) : (
                    <ModalContent>
                        <ModalHeader>Wird geladen...</ModalHeader>
                        <ModalCloseButton />
                    </ModalContent>
                )}
            </Modal>
        </>
    );
};

export default ClientUserAssignmentModal;
