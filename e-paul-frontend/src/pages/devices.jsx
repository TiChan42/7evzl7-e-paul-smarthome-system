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
    VStack,
    useToast,
    Tooltip,
    CardHeader,
    SimpleGrid,
    Text,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import AddGroupDialog from "@/components/addGroupDialog";
import AddDeviceDialog from "@/components/addDeviceDialog";
import OpenHistoryDrawer from "@/components/openhistoryDrawer";
import { decryptString } from '@/utils/encryptionUtils';
import { LuLamp } from "react-icons/lu";
import { MdArrowForwardIos } from "react-icons/md";
import Clock from 'react-live-clock';
import {env} from '@/utils/env';

const DeviceCard = ({ device }) => (
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
            {device.name}
          </Text>
        </CardBody>
        <MdArrowForwardIos align="end" size={"30px"} />
      </Center>
    </Card>
  );

const DeviceList = ({ data }) => (
    <VStack spacing={2} align="stretch">
      {data.map(device => (
        <DeviceCard key={device.id} device={device} />
      ))}
      if(data.length === 0) {
        <Text fontSize={"xl"} fontWeight={"bold"}>Keine Geräte vorhanden</Text>
        }
    </VStack>
  );

function DeviceOverview() {
    const userID = decryptString(sessionStorage.getItem('executingUserID'));
    const accountID = decryptString(sessionStorage.getItem("accountID")); 
    const current = new Date();
    const date = `${current.getDate()}.${current.getMonth() + 1}.${current.getFullYear()}`;
    const toast = useToast()
    const [users, setUsers] = useState(null);
    const [devices, setDevices] = useState([]);
    let username = "username";

    // save username in variable
    if (users) {
        username = users.username;
    }

    useEffect(()=>{
        fetchUsers(accountID)
        fetchDevices(accountID);
    },[accountID])

    /*Auf die Startseite wenn nicht angemeldet
    useEffect(() => {
        if (sessionStorage.getItem("accountID") == null) {
        window.location.href = "/";
        }
    }, []); */

    function fetchDevices(accountID) {
    const fetchPath = env()["api-path"] + "devices/" + accountID;
    console.log(fetchPath);
    fetch(fetchPath, { method: "POST" })
      .then(response => {
        console.log(response); // HTTP-Response ausgeben
        return response.json();
      })
      .then(data => {
        console.log(data);
        if (data["devices"].length === 0) {
          console.log('Kein Gerät vorhanden')
        } else {
          setDevices(data["devices"]);
        }
      })
      .catch(error => {
        console.log('Geräte konnten nicht geladen werden')
        toast({
          title: 'Geräte konnten nicht geladen werden',
          status: 'error',
          duration: 10000,
          isClosable: true,
        });
        });
    };

    //fetch users from backend
    function fetchUsers(accountID) {
        //später auf 0 prüfen und dann nicht laden
        const fetchPath = env()["api-path"] + "getUser/" + userID;
        console.log(fetchPath);
        fetch(fetchPath, {method: "GET"})
        .then(response => {
            console.log(response); // HTTP-Response ausgeben
            return response.json();
        })
        .then(data => {
        console.log(data);
        setUsers(data["user"]);
        if (data["user"][0] == null) {
            console.log('Kein Benutzer vorhanden')
        }
        })
        .catch(error => {
        console.log('Benuzterdaten konnten nicht geladen werden')
        toast({
            title: 'Benuzterdaten konnten nicht geladen werden',
            status: 'error',
            duration: 10000,
            isClosable: true,
        });
        });
    };

    return (
        <Box h={"100%"} w={["100%", "85%", "70%"]}>
            <Flex pt={4} pl={4} pr={4}>
                <Heading>Hallo {username}!</Heading>
                <Spacer></Spacer>
                <OpenHistoryDrawer></OpenHistoryDrawer>
            </Flex>

            <Box p={4}>
                <Grid
                    templateRows="repeat(2, 1fr)"
                    templateColumns="repeat(3, 1fr)"
                    gap={4}
                >
                    <GridItem colSpan={1}>
                        <Card bg={"blue2"} w="100%" h="100%">
                            <CardHeader>
                                <Heading size="lg" color={"white"}>
                                    Statusmeldung
                                </Heading>
                                <Text color={"white"} fontSize='lg' as={'b'}>
                                    Datum: {date} <br/>
                                    Uhrzeit: <Clock format={'HH:mm:ss'} ticking={true} timezone={'US/Pacific'} />
                                </Text>
                            </CardHeader>
                        </Card>
                    </GridItem>

                    <GridItem rowSpan={2} colSpan={1}>
                        <Card bg={"blue2"} w="100%" h="100%">
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
                                <AddGroupDialog devices={devices}/>
                            </Box>
                        </Card>
                    </GridItem>

                    <GridItem rowSpan={2} colSpan={1}>
                        <Card bg={"blue2"} w="100%" h="100%">
                            <CardHeader>
                                <Heading size="lg" color={"white"}>
                                    Meine Geräte
                                </Heading>
                            </CardHeader>
                            <CardBody>
                                <DeviceList data={devices} />
                            </CardBody>
                            <Box align="end" m={4}>
                                <AddDeviceDialog />
                            </Box>
                        </Card>
                    </GridItem>

                    <GridItem colSpan={1}>
                        <Card bg={"blue2"} w="100%" h="100%">
                            <CardHeader>
                                <Heading size="lg" color={"white"}>
                                    Favoriten
                                </Heading>
                            </CardHeader>
                            <CardBody>
                                <SimpleGrid columns={[2, 3, 4]} w={"100%"} gap={[1, 2, 4]}>
                                    <Tooltip label="Lampe1" aria-label='A tooltip'>
                                        <Card bg={"#3e5f74"} aspectRatio={1} cursor="pointer" p={1} color={'white'}>
                                            <Center>
                                                <LuLamp size={"100%"}/>
                                            </Center>
                                        </Card>
                                    </Tooltip>

                                </SimpleGrid>
                            </CardBody>
                        </Card>
                    </GridItem>
                </Grid>
            </Box>
        </Box>
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
