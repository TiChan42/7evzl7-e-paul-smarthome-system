import React, { Component, useEffect, useState } from 'react';
import {
    Heading,
    Grid,
    Box,
    GridItem,
    Card,
    Center,
    Button,
    Flex,
    Spacer,
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    CardBody,
    Divider,
    TabList,
    TabPanels,
    TabPanel,
    VStack,
    useToast,
    Tooltip,
    CardHeader,
    SimpleGrid,
    Text,
    Tabs,
    Tab,
    useBreakpointValue,
} from '@chakra-ui/react';
import { SettingsIcon, ArrowRightIcon } from '@chakra-ui/icons';
import AddGroupDialog from '../components/addGroupDialog';
import EditGroupDialog from '../components/editGroupDialog';
import OpenHistoryDrawer from '../components/openhistoryDrawer';
import { decryptString, encryptString } from '../utils/encryptionUtils';
import { LuLamp } from 'react-icons/lu';
import { MdArrowForwardIos } from 'react-icons/md';
import Clock from 'react-live-clock';
import { env } from '../utils/env';
import ControllerCommandsModal from '../components/controllerCommandsModal';

function DeviceOverview() {
    const [userID, setUserID] = useState(
        decryptString(sessionStorage.getItem('executingUserID'))
    );
    const [accountID, setAccountID] = useState(
        decryptString(sessionStorage.getItem('accountID'))
    );
    const toast = useToast();

    const [accountClients, setAccountClients] = useState([]);
    const [favoriteClients, setFavoriteClients] = useState([]);
    const [user, setUser] = useState([]);
    const [userClientIDs, setUserClientIDs] = useState([]);
    //eslint-disable-next-line
    const [groupID, setGroupID] = useState();

    const [userRights, setUserRights] = useState([]);
    const isSmallScreen = useBreakpointValue({ base: true, lg: false });

    //Auf die Startseite wenn nicht angemeldet
    useEffect(() => {
        if (sessionStorage.getItem('accountID') == null) {
            window.location.href = '/';
        }
    }, []);

    //Beim Öffnen der Seite die Daten asynchron laden
    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, []);

    const fetchData = async () => {
        await setAccountID(decryptString(sessionStorage.getItem('accountID')));
        await setUserID(
            decryptString(sessionStorage.getItem('executingUserID'))
        );
        await fetchUserClientIDs();
        await fetchAccountClients();
        await fetchUser(userID);
        await fetchUserClientIDs();
        await fetchUserGroups();
        await fetchUserRights(userID);
    };

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
                toast({
                    title: 'Geräte konnten nicht geladen werden',
                    status: 'error',
                    duration: 10000,
                    isClosable: true,
                });
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
                toast({
                    title: 'Geräte konnten nicht geladen werden',
                    status: 'error',
                    duration: 10000,
                    isClosable: true,
                });
            });
    };

    const fetchUser = (userID) => {
        fetch(env()['api-path'] + 'user/' + userID, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setUser(data);
            })
            .catch((error) => {
                console.error('Error(fetchUsers):', error);
                setUser([]);
                toast({
                    title: 'Benutzer konnte nicht geladen werden',
                    status: 'error',
                    duration: 10000,
                    isClosable: true,
                });
            });
    };

    const fetchUserGroups = () => {
        fetch(env()['api-path'] + 'getGroup/Favorite/' + userID, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setFavoriteClients(data[1]);
            })
            .catch((error) => {
                console.error('Error(fetchUserClientIDs):', error);
                setGroupID(null);
                setUserClientIDs([]);
            });
    };

    const fetchUserRights = () => {
        fetch(env()['api-path'] + 'getUserRights/' + userID + '/' + userID, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setUserRights(data);
            })
            .catch((error) => {
                console.error('Error(fetchUsersRights):', error);
                toast({
                    title: 'Benutzerrechte konnten nicht geladen werden',
                    status: 'error',
                    duration: 10000,
                    isClosable: true,
                });
            });
    };

    return (
        <Box
            w={'100%'}
            h={'100%'}
            mr={['1%', '2%', '4%', '5%']}
            ml={['1%', '2%', '4%', '5%']}
        >
            <Flex
                pt={4}
                pr={4}
                pl={4}
            >
                <Heading color='#3e5f74'>Hallo {user.username}</Heading>
                <Spacer></Spacer>
                <SettingsButton
                    userRights={userRights}
                    userRole={user.role}
                    Text={isSmallScreen ? '' : ' Einstellungen'}
                />
                <OpenHistoryDrawer Text={isSmallScreen ? '' : ' Verlauf'} />
            </Flex>

            {isSmallScreen ? (
                // Render the original layout for small screens
                <Box p={4}>
                    {/* Statusmeldung */}
                    <Status />

                    {/* Tabs for MyDevices, Groups, and Favorites */}
                    <Tabs
                        mt={4}
                        backgroundcolor={'teal.400'}
                        isFitted
                        variant='enclosed'
                    >
                        <TabList color={'#3e5f74'}>
                            <Tab
                                fontWeight={'bold'}
                                _selected={{ color: 'white', bg: 'teal.400' }}
                            >
                                Meine Geräte
                            </Tab>
                            <Tab
                                fontWeight={'bold'}
                                _selected={{ color: 'white', bg: 'teal.400' }}
                            >
                                Gruppen
                            </Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel p={0}>
                                <VStack gap={4}>
                                    <Favourites
                                        favoriteClients={favoriteClients}
                                        radius={0}
                                    />
                                    {/* MyDevices component */}
                                    <MyDevices
                                        accountClients={accountClients}
                                        userClientIDs={userClientIDs}
                                    />
                                </VStack>
                            </TabPanel>
                            <TabPanel p={0}>
                                {/* Groups component */}
                                <Groups
                                    radius={0}
                                    userID={userID}
                                />
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>
            ) : (
                // Render the original layout for large screens
                <Box p={4}>
                    <Grid
                        gap={4}
                        templateRows={'repeat(2, 1fr)'}
                        templateColumns={'repeat(3, 1fr)'}
                    >
                        {/* Statusmeldung */}
                        <GridItem colSpan={1}>
                            <Status />
                        </GridItem>

                        {/* Gruppen */}
                        <GridItem
                            colSpan={1}
                            rowSpan={2}
                        >
                            <Groups userID={userID} />
                        </GridItem>

                        {/* Meine Geräte */}
                        <GridItem
                            colSpan={1}
                            rowSpan={2}
                        >
                            <MyDevices
                                accountClients={accountClients}
                                userClientIDs={userClientIDs}
                            />
                        </GridItem>

                        {/* Favoriten */}
                        <GridItem colSpan={1}>
                            <Favourites favoriteClients={favoriteClients} />
                        </GridItem>
                    </Grid>
                </Box>
            )}
        </Box>
    );
}

function DeviceCard({ clientName, client }) {
    const [commandModal, setCommandModal] = useState(false);

    return (
        <>
            <Button
                bg={'transparent'}
                onClick={() => {
                    setCommandModal(true);
                }}
            >
                <Card
                    direction={{
                        base: 'column',
                        sm: 'row',
                    }}
                    overflow='hidden'
                    w={'100%'}
                    color={'white'}
                    bg={'#3e5f74'}
                    cursor='pointer'
                >
                    <Center
                        w={'100%'}
                        h={'100%'}
                        p={1}
                    >
                        <LuLamp size={'30px'} />
                        <CardBody p={0}>
                            <Text
                                pl={2}
                                fontSize={'xl'}
                                fontWeight={'bold'}
                            >
                                {clientName}
                            </Text>
                        </CardBody>
                        <MdArrowForwardIos
                            align='end'
                            size={'30px'}
                        />
                    </Center>
                </Card>
            </Button>
            <ControllerCommandsModal
                openModal={commandModal}
                closeModal={() => {
                    setCommandModal(false);
                }}
                client={client}
            />
        </>
    );
}

function MyDevices({ accountClients, userClientIDs }) {
    const DeviceList = ({ clients, userClientIDs, variant }) => {
        const [elementsToShow, setElementsToShow] = useState([]);

        useEffect(() => {
            if (variant) {
                var temp = [];
                if (
                    clients &&
                    userClientIDs &&
                    clients[0] &&
                    userClientIDs[0]
                ) {
                    userClientIDs.forEach((id) => {
                        temp.push(clients.find((client) => client.id === id));
                    });
                }
                setElementsToShow(temp);
            } else {
                if (
                    clients &&
                    userClientIDs &&
                    clients[0] &&
                    userClientIDs[0]
                ) {
                    setElementsToShow(
                        clients.filter(
                            (client) => !userClientIDs.includes(client.id)
                        )
                    );
                } else if (clients && clients[0]) {
                    setElementsToShow(clients);
                }
            }
        }, [clients, variant, userClientIDs]);

        const generateNameOutOfID = (id) => {
            let temp = ((id * 2345 + id * 856 + id * 71) / id) * id;
            //More complex function to generate a name out of the id
            temp =
                ((temp * 2345 + temp * 856 + temp * 71) / temp) * temp * temp;
            return 'Client_' + temp.toString();
        };

        return (
            <Box
                overflowY='auto'
                maxH='400px'
            >
                <VStack
                    align='stretch'
                    spacing={2}
                >
                    {elementsToShow.length === 0 ? (
                        <Text
                            fontSize='xl'
                            fontWeight='bold'
                        >
                            Keine Geräte vorhanden
                        </Text>
                    ) : (
                        elementsToShow.map((client) => (
                            <DeviceCard
                                key={encryptString(client.id.toString())}
                                clientName={
                                    client.name
                                        ? client.name
                                        : generateNameOutOfID(client.id)
                                }
                                clientType={client.type}
                                client={client}
                            />
                        ))
                    )}
                </VStack>
            </Box>
        );
    };

    return (
        <Card
            w='100%'
            h='100%'
            bg={'teal.400'}
        >
            <CardHeader>
                <Heading
                    color={'white'}
                    size='lg'
                >
                    Meine Geräte
                </Heading>
            </CardHeader>
            <CardBody>
                <DeviceList
                    clients={accountClients}
                    userClientIDs={userClientIDs}
                    variant={true}
                />
            </CardBody>
        </Card>
    );
}

function SettingsButton(props) {
    const openSettings = () => {
        if (props.userRole === 'admin' || props.userRole === 'superuser') {
            window.location.href = '/userAdministration';
        } else {
            sessionStorage.setItem(
                'userToEdit',
                sessionStorage.getItem('executingUserID')
            );
            window.location.href = '/settings';
        }
    };

    return (
        <Tooltip
            aria-label='A tooltip'
            label={
                props.userRights['mayChangeOwnUserSettings'] === 0
                    ? 'Fehlende Berechtigungen'
                    : 'Zu den Einstellungen'
            }
        >
            <Button
                mr={4}
                color='white'
                bg='#3e5f74'
                isDisabled={props.userRights['mayChangeOwnUserSettings'] === 0}
                onClick={openSettings}
            >
                {<SettingsIcon m={1} />}
                {props.Text}
            </Button>
        </Tooltip>
    );
}

function Favourites({ favoriteClients, isSmallScreen, radius }) {
    const FavoriteCard = (key, client) => {
        return (
            <Tooltip
                aria-label='A tooltip'
                label={client.clientName}
            >
                <Card
                    p={1}
                    color={'white'}
                    bg={'#3e5f74'}
                    cursor='pointer'
                    aspectRatio={1}
                >
                    <Center>
                        <LuLamp size={'100%'} />
                    </Center>
                </Card>
            </Tooltip>
        );
    };

    return (
        <Card
            w='100%'
            h='100%'
            bg={'teal.400'}
            borderTopRadius={radius}
        >
            <CardHeader>
                <Heading
                    color={'white'}
                    size='lg'
                >
                    Favoriten
                </Heading>
            </CardHeader>
            <CardBody>
                <SimpleGrid
                    gap={[1, 2, 4]}
                    w={'100%'}
                    columns={[2, 3, 4]}
                >
                    {favoriteClients.map((client, index) => (
                        <FavoriteCard
                            key={index}
                            client={client}
                        />
                    ))}
                </SimpleGrid>
            </CardBody>
        </Card>
    );
}

// eslint-disable-next-line
function Status({}) {
    const current = new Date();
    const date = `${current.getDate()}.${current.getMonth() + 1}.${current.getFullYear()}`;

    return (
        <Card
            w='100%'
            h='100%'
            bg={'teal.400'}
        >
            <CardHeader>
                <Heading
                    color={'white'}
                    size='lg'
                >
                    Statusmeldung
                </Heading>
                <Text
                    as={'b'}
                    color={'white'}
                    fontSize='lg'
                >
                    Datum: {date} <br />
                    Uhrzeit:{' '}
                    <Clock
                        format={'HH:mm:ss'}
                        ticking={true}
                        timezone={
                            Intl.DateTimeFormat().resolvedOptions().timeZone
                        }
                    />
                </Text>
            </CardHeader>
        </Card>
    );
}

function Groups(props) {
    const [standardGroups, setStandardGroups] = useState([]);

    //Beim Öffnen der Seite die Daten asynchron laden
    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, []);

    const fetchData = async () => {
        await fetchUserStandardGroups();
    };

    //Gruppen des Benutzers laden
    const fetchUserStandardGroups = () => {
        fetch(env()['api-path'] + 'getGroup/Standard/' + props.userID, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setStandardGroups(data);
            })
            .catch((error) => {
                console.error('Error(fetchUserClientIDs):', error);
                setStandardGroups([]);
            });
    };

    return (
        <Card
            w='100%'
            h='100%'
            bg={'teal.400'}
            borderTopRadius={props.radius}
        >
            <CardHeader>
                <Heading
                    color={'white'}
                    size='lg'
                >
                    Gruppen
                </Heading>
            </CardHeader>
            <CardBody>
                <Box borderRadius='lg'>
                    {standardGroups[0] ? (
                        <>
                            {standardGroups.map((group, index) => (
                                <Group
                                    key={'groupAccordion-' + index}
                                    fetchData={() => {
                                        fetchData();
                                    }}
                                    group={group}
                                />
                            ))}
                        </>
                    ) : (
                        <Center>
                            <Text
                                fontSize='lg'
                                fontWeight='bold'
                            >
                                Keine Gruppen vorhanden
                            </Text>
                        </Center>
                    )}
                </Box>
            </CardBody>
            <Box
                align='end'
                m={4}
            >
                <AddGroupDialog
                    updateGroup={() => {
                        fetchData();
                    }}
                />
            </Box>
        </Card>
    );
}

function Group(props) {
    const toast = useToast();

    const accordionRef = React.useRef();

    const [scenes, setScenes] = useState([]);

    //Szenen der Gruppe laden
    const fetchGroupScenes = (groupID) => {
        fetch(env()['api-path'] + 'getScenes/' + groupID, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setScenes(data);
            })
            .catch((error) => {
                console.error('Error(fetchUserClientIDs):', error);
            });
    };

    //Szene ausführen
    const executeScene = (sceneID) => {
        let userID = decryptString(sessionStorage.getItem('executingUserID'));
        if (userID) {
            let data = {
                executingUserId: userID,
                groupId: props.group.id,
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

    return (
        <Accordion
            overflow={'hidden'}
            mt={2}
            borderWidth={'0px'}
            borderRadius={'10px'}
            allowToggle
        >
            <AccordionItem border={0}>
                <AccordionButton
                    ref={accordionRef}
                    w={'100%'}
                    color={'secondary.50'}
                    bg={'secondary.500'}
                    borderTopRadius={'10px'}
                    _hover={{ bg: 'secondary.450' }}
                    _active={{ bg: 'secondary.550' }}
                    onClick={() => {
                        //Beim öffnen des Accordions die Szenen laden
                        if (
                            accordionRef.current.getAttribute(
                                'aria-expanded'
                            ) === 'false'
                        ) {
                            fetchGroupScenes(props.group.id);
                        }
                    }}
                >
                    <Box
                        as='span'
                        flex='1'
                        w={'90%'}
                        minW={'90%'}
                        fontWeight={'bold'}
                        textAlign='left'
                    >
                        <Text noOfLines={1}>{props.group.name}</Text>
                    </Box>
                    <AccordionIcon />
                </AccordionButton>
                <AccordionPanel
                    pb={4}
                    bg={'teal.300'}
                    borderWidth={'0px'}
                >
                    <Box>
                        <Heading size={'sm'}>Szenen der Gruppe</Heading>
                        {scenes[0] ? (
                            <>
                                {scenes.map((scene, index) => (
                                    <Tooltip
                                        key={'scene-' + index}
                                        color={'teal.100'}
                                        bg={'secondary.700'}
                                        hasArrow
                                        label='Klicken zum ausführen der Szene'
                                        placement='auto-start'
                                    >
                                        <Button
                                            w={'100%'}
                                            mt={2}
                                            p={2}
                                            color={'secondary.500'}
                                            borderColor={'secondary.500'}
                                            _hover={{
                                                bg: 'teal.350',
                                                borderColor: 'secondary.500',
                                            }}
                                            _active={{
                                                bg: 'secondary.500',
                                                color: 'teal.100',
                                                borderColor: 'teal.300',
                                            }}
                                            onClick={() => {
                                                executeScene(scene.id);
                                            }}
                                            variant={'outline'}
                                        >
                                            <Flex
                                                alignSelf={'left'}
                                                w={'100%'}
                                            >
                                                <Box
                                                    as='span'
                                                    flex='1'
                                                    w={'80%'}
                                                    minW={'80%'}
                                                    maxW={'80%'}
                                                    fontWeight={'bold'}
                                                    textAlign='left'
                                                >
                                                    <Text noOfLines={1}>
                                                        {scene.name}
                                                    </Text>
                                                </Box>

                                                <Spacer />
                                                <ArrowRightIcon />
                                            </Flex>
                                        </Button>
                                    </Tooltip>
                                ))}
                            </>
                        ) : (
                            <Center>
                                <Text
                                    fontSize='lg'
                                    fontWeight='bold'
                                >
                                    Keine Szenen vorhanden
                                </Text>
                            </Center>
                        )}
                    </Box>
                    <Divider
                        mt={4}
                        mb={4}
                        borderColor={'teal.500'}
                        orientation='horizontal'
                    />
                    <Box align='end'>
                        <EditGroupDialog
                            id={props.group.id}
                            updateGroup={() => {
                                props.fetchData();
                            }}
                        />
                    </Box>
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    );
}

class Devices extends Component {
    render() {
        return (
            <Center>
                <DeviceOverview />
            </Center>
        );
    }
}

export default Devices;
