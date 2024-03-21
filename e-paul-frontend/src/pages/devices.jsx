import { Component, useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { SettingsIcon } from "@chakra-ui/icons";
import AddGroupDialog from "@/components/addGroupDialog";
import AddDeviceDialog from "@/components/addDeviceDialog";
import OpenHistoryDrawer from "@/components/openhistoryDrawer";
import { decryptString, encryptString } from '@/utils/encryptionUtils';
import { LuLamp } from "react-icons/lu";
import { MdArrowForwardIos } from "react-icons/md";
import Clock from 'react-live-clock';
import {env} from '@/utils/env';
import { useBreakpointValue } from "@chakra-ui/react";


function DeviceOverview() {
    const [userID, setUserID] = useState(decryptString(sessionStorage.getItem('executingUserID')));
    const [accountID, setAccountID] = useState(decryptString(sessionStorage.getItem('accountID')));
    const toast = useToast()

    const [accountClients, setAccountClients] = useState([]);
    const [favoriteClients, setFavoriteClients] = useState([]);
    const [user, setUser] = useState([]);
    const [userClientIDs, setUserClientIDs] = useState([]);
    const [groupID, setGroupID] = useState();
    const [userRights, setUserRights] = useState([]);
    const isSmallScreen = useBreakpointValue({ base: true, lg: false });

    //Auf die Startseite wenn nicht angemeldet
    useEffect(() => {
        if (sessionStorage.getItem("accountID") == null) {
        window.location.href = "/";
        }
    }, []);

    //Beim Öffnen der Seite die Daten asynchron laden
    useEffect( () => {
        fetchData();
    }, []);	

    const fetchData = async () => {
        await setAccountID(decryptString(sessionStorage.getItem('accountID')));
        await setUserID(decryptString(sessionStorage.getItem('executingUserID')));
        await fetchUserClientIDs();
        await fetchAccountClients();
        await fetchUser(userID);
        await fetchUserClientIDs();
        await fetchUserGroups();
        await fetchUserRights(userID);
    }

    const fetchAccountClients = () => {
        fetch(env()["api-path"] + 'getPorts/'+ accountID , {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
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
        fetch(env()["api-path"] + 'getGroup/Assignment/' + userID, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
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
    }

    const fetchUser = (userID) => { 
        fetch(env()["api-path"] + 'user/' + userID, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            setUser(data);
            console.log('User: ', data);
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
    }

    const fetchUserGroups = () => {
        fetch(env()["api-path"] + 'getGroup/Favorite/' + userID, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            setFavoriteClients(data[1]);
        })
        .catch((error) => {
            console.error('Error(fetchUserClientIDs):', error);
            setGroupID(null);
            setUserClientIDs([]);
        });
    };

    const fetchUserRights = () => { 
        fetch(env()["api-path"] + 'getUserRights/' + userID + '/' + userID, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json()) 
        .then(data => {
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
    }

    return (
        <Box h={"100%"} w={"100%"}  marginLeft={['1%', '2%', '4%', '5%']} marginRight={['1%', '2%', '4%', '5%']}>
            <Flex pt={4} pl={4} pr={4} flexDirection={{ base: "column", md: "row" }} alignItems={{ base: "start", md: "center" }}>
                <Heading color="#3e5f74" mb={{ base: 2, md: 0 }}>Hallo {user.username}</Heading>
                <Spacer />
                <Flex flexDirection={'horizontal'}>
                    <SettingsButton userRights={userRights} userRole={user.role} Text={isSmallScreen ? ("") : ("Einstellungen")} />
                    <OpenHistoryDrawer Text={isSmallScreen ? ("") : ("Verlauf")} />
                </Flex>
            </Flex>

            {isSmallScreen ? (
            <>
                { /* Render the original layout for small screens */ }
                <Box p={4}>
                    {/* Statusmeldung */}
                    <Status />

                    {/* Tabs for MyDevices, Groups, and Favorites */}
                    <Tabs isFitted variant='enclosed' backgroundcolor={"blue2"} mt={4}>
                        <TabList color={"#3e5f74"}>
                            <Tab fontWeight={'bold'} _selected={{ color: 'white', bg: 'blue2'}}>Meine Geräte</Tab>
                            <Tab fontWeight={'bold'} _selected={{ color: 'white', bg: 'blue2'}}>Gruppen</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel p={0}>
                                <VStack gap={4}>
                                    <Favourites favoriteClients={favoriteClients} radius={0}/>
                                    {/* MyDevices component */}
                                    <MyDevices accountClients={accountClients} userClientIDs={userClientIDs}/>
                                </VStack>
                            </TabPanel>
                            <TabPanel p={0}>
                                {/* Groups component */}
                                <Groups radius={0}/>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>
            </>
            ) : (
            <>
                { /* Render the original layout for large screens */ }
                <Box p={4}>
                    <Grid
                        templateRows={"repeat(2, 1fr)"}
                        templateColumns={"repeat(3, 1fr)"}
                        gap={4}
                    >
                        {/* Statusmeldung */}
                        <GridItem colSpan={1}>
                           <Status />
                        </GridItem>

                        {/* Gruppen */}
                        <GridItem rowSpan={2} colSpan={1}>
                            <Groups />
                        </GridItem>

                        {/* Meine Geräte */}
                        <GridItem rowSpan={2} colSpan={1}>
                            <MyDevices accountClients={accountClients} userClientIDs={userClientIDs}/>
                        </GridItem>

                        {/* Favoriten */}
                        <GridItem colSpan={1}>
                            <Favourites favoriteClients={favoriteClients}/>
                        </GridItem>
                    </Grid>
                </Box>#
            </>
            )}
        </Box>
    );
}

function MyDevices({ accountClients, userClientIDs }) {

    const DeviceCard = ({ clientName }) => (
        <Card
          direction={{
            base: "column",
            sm: "row",
          }}
          overflow="hidden"
          bg={"#3e5f74"}
          color={"white"}
          cursor="pointer"
        >
          <Center p={1} h={"100%"} w={"100%"}>
            <LuLamp size={"30px"} />
            <CardBody p={0}>
              <Text pl={2} fontSize={"xl"} fontWeight={"bold"}>
                {clientName}
              </Text>
            </CardBody>
            <MdArrowForwardIos align="end" size={"30px"} />
          </Center>
        </Card>
    );
    
    const DeviceList = ({ clients, userClientIDs, variant }) => {
        const [elementsToShow, setElementsToShow] = useState([]);
    
        useEffect(() => {
            if (variant) {
                var temp = [];
                if (clients && userClientIDs && clients[0] && userClientIDs[0]) {
                    userClientIDs.forEach((id) => {
                        temp.push(clients.find(client => client.id === id));
                    });
                }
                setElementsToShow(temp);
            } else {
                if (clients && userClientIDs && clients[0] && userClientIDs[0]) {
                    setElementsToShow(clients.filter(client => !userClientIDs.includes(client.id)));
                } else if (clients && clients[0]) {
                    setElementsToShow(clients);
                }
            }
        }, [clients, variant, userClientIDs]);
    
        const generateNameOutOfID = (id) => {
            let temp = (id*2345+id*856+id*71)/id*id
            //More complex function to generate a name out of the id
            temp = (temp*2345+temp*856+temp*71)/temp*temp*temp;
            return 'Client_'+temp.toString();
        }
    
        return (
            <Box maxH="400px" overflowY="auto">
                <VStack spacing={2} align="stretch">
                    {elementsToShow.length === 0 ? (
                        <Text fontSize="xl" fontWeight="bold">Keine Geräte vorhanden</Text>
                    ) : (
                        elementsToShow.map((client) => (
                            <DeviceCard key={encryptString(client.id.toString())}  clientName={client.name ? client.name : generateNameOutOfID(client.id)} clientType={client.type}/>
                        ))
                    )}
                </VStack>
            </Box>
        );
    }

    return (
        <Card bg={"blue2"} w="100%" h="100%">
            <CardHeader>
                <Heading size="lg" color={"white"}>
                    Meine Geräte
                </Heading>
            </CardHeader>
            <CardBody>
                <DeviceList clients={accountClients} userClientIDs={userClientIDs} variant={true}/>
            </CardBody>
            <Box align="end" m={4}>
                <AddDeviceDialog />
            </Box>
        </Card>
    )
}

function SettingsButton(props) {
    
    const openSettings = () => {
        if (props.userRole === "admin" || props.userRole === "superuser") {
            window.location.href = "/userAdministration";
        } else {
            sessionStorage.setItem('userToEdit',sessionStorage.getItem('executingUserID'))
		    window.location.href = '/settings'
        }
    }
    
    return (
        <Tooltip label={props.userRights['mayChangeOwnUserSettings'] === 0 ? "Fehlende Berechtigungen" : "Zu den Einstellungen"} aria-label="A tooltip">
            <Button
                isDisabled={(props.userRights['mayChangeOwnUserSettings'] === 0)} 
                background="#3e5f74" 
                color="white"
                marginRight={4}
                onClick={openSettings}
            >
                {<SettingsIcon m={1}/>}
                {props.Text}
            </Button>
        </Tooltip>   
    )
}

function Favourites({favoriteClients, isSmallScreen, radius}) {

    const FavoriteCard = (key, client) => {
        return (
            <Tooltip label={client.clientName} aria-label='A tooltip'>
                <Card bg={"#3e5f74"} aspectRatio={1} cursor="pointer" p={1} color={'white'}>
                    <Center>
                        <LuLamp size={"100%"}/>
                    </Center>
                </Card>
            </Tooltip>
        )
    };
    
    return (
             <Card bg={"blue2"} w="100%" h="100%" borderTopRadius={radius}>
                <CardHeader>
                    <Heading size="lg" color={"white"}>
                        Favoriten
                    </Heading>
                </CardHeader>
                <CardBody>
                <SimpleGrid columns={[2, 3, 4]} w={"100%"} gap={[1, 2, 4]}>
                    {favoriteClients.map((client, index) => (
                        <FavoriteCard key={index} client={client} />
                    ))}
                </SimpleGrid>
                </CardBody>
            </Card>
        
    )

}

function Status ({}) {

    const current = new Date();
    const date = `${current.getDate()}.${current.getMonth() + 1}.${current.getFullYear()}`;

    return (
        <Card bg={"blue2"} w="100%" h="100%">
            <CardHeader>
                <Heading size="lg" color={"white"}>
                    Statusmeldung
                </Heading>
                <Text color={"white"} fontSize='lg' as={'b'}>
                    Datum: {date} <br/>
                    Uhrzeit: <Clock format={'HH:mm:ss'} ticking={true} timezone={Intl.DateTimeFormat().resolvedOptions().timeZone} />
                </Text>
            </CardHeader>
        </Card>
    )
}

function Groups ({radius}) {
    
    return (
        <Card bg={"blue2"} w="100%" h="100%" borderTopRadius={radius}>
            <CardHeader>
                <Heading size="lg" color={"white"}>
                    Gruppen
                </Heading>
            </CardHeader>
            <CardBody>
                <Accordion allowToggle borderRadius="lg">
                    <AccordionItem>
                        <h2>
                            <AccordionButton
                                background={"#3e5f74"}
                                _hover={{ bg: "#5b7a91" }}
                            >
                                <Box
                                    as="span"
                                    flex="1"
                                    textAlign="left"
                                    fontWeight={"bold"}
                                >
                                    Gruppe1
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel
                            pb={4}
                            background={"#7b99a7"}
                        >
                            <Button mr={4}>Szene1</Button>
                            <Button mr={4}>Szene2</Button>
                            <Divider
                                mt={4}
                                mb={4}
                                orientation="horizontal"
                            />
                            <Box align="end">
                                <Button ml={4}>
                                    <EditIcon mr={2}></EditIcon>{" "}
                                    Bearbeiten{" "}
                                </Button>
                            </Box>
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>
            </CardBody>
            <Box align="end" m={4}>
                <AddGroupDialog />
            </Box>
        </Card>
    )
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
