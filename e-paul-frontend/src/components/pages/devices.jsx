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
    CardHeader,
    SimpleGrid,
    AspectRatio,
    Text,
    Square,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import AddGroupDialog from "../addGroupDialog";
import AddDeviceDialog from "../addDeviceDialog";
import OpenHistoryDrawer from "../openhistoryDrawer";
//import { decryptString } from '../../encryptionUtils';
import { LuLamp } from "react-icons/lu";
import { MdArrowForwardIos } from "react-icons/md";
import Clock from 'react-live-clock';

function DeviceOverview() {
    //userID = decryptString(sessionStorage.getItem('executingUserID').toString());

    /*Auf die Startseite wenn nicht angemeldet
    useEffect(() => {
        if (sessionStorage.getItem("accountID") == null) {
        window.location.href = "/";
        }
    }, []);
    */

    const current = new Date();
    const date = `${current.getDate()}.${current.getMonth() + 1}.${current.getFullYear()}`;

    return (
        <Box h={"100%"} w={["100%", "85%", "70%"]}>
            <Flex pt={4} pl={4} pr={4}>
                <Heading>Hallo ''Name''!</Heading>
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
                                <Text color={"white"} fontSize='lg'>
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

                                    <AccordionItem>
                                        {({ isExpanded }) => (
                                            <>
                                                <h2>
                                                    <AccordionButton
                                                        background={"#3e5f74"}
                                                        _hover={{
                                                            bg: "#536f82",
                                                        }}
                                                    >
                                                        <Box
                                                            as="span"
                                                            flex="1"
                                                            textAlign="left"
                                                            fontWeight={"bold"}
                                                        >
                                                            Gruppe2
                                                        </Box>
                                                        <AccordionIcon />
                                                    </AccordionButton>
                                                </h2>
                                                <AccordionPanel
                                                    pb={4}
                                                    background={"#91a3af"}
                                                >
                                                    <Button mr={4}>
                                                        Szene1
                                                    </Button>
                                                    <Button mr={4}>
                                                        Szene2
                                                    </Button>
                                                    <Divider
                                                        mt={4}
                                                        mb={4}
                                                        orientation="horizontal"
                                                    />
                                                    <Box align="end">
                                                        <Button ml={4}>
                                                            <EditIcon
                                                                mr={2}
                                                            ></EditIcon>
                                                            Bearbeiten{" "}
                                                        </Button>
                                                    </Box>
                                                </AccordionPanel>
                                            </>
                                        )}
                                    </AccordionItem>
                                </Accordion>
                            </CardBody>
                            <Box align="end" m={4}>
                                <AddGroupDialog />
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
                                <VStack spacing={2} align="stretch">
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
                                                <Text
                                                    pl={2}
                                                    fontSize={"xl"}
                                                    fontWeight={"bold"}
                                                >
                                                    Lampe1
                                                </Text>
                                            </CardBody>
                                            <MdArrowForwardIos
                                                align="end"
                                                size={"30px"}
                                            />
                                        </Center>
                                    </Card>

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
                                                <Text
                                                    pl={2}
                                                    fontSize={"xl"}
                                                    fontWeight={"bold"}
                                                >
                                                    Lampe2
                                                </Text>
                                            </CardBody>
                                            <MdArrowForwardIos
                                                align="end"
                                                size={"30px"}
                                            />
                                        </Center>
                                    </Card>
                                </VStack>
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
                                <SimpleGrid templateColumns="repeat(5, 1fr)" w={"100%"} gap={[1, 2, 4]}>
                                    <Card bg={"#3e5f74"} aspectRatio={1} cursor="pointer"
>

                                    </Card>

                                    <Card bg={"#3e5f74"} aspectRatio={1} cursor="pointer"
>
                                            A
                                    </Card>

                                    <Card bg={"#3e5f74"} aspectRatio={1} cursor="pointer"
>
                                            A
                                    </Card>

                                    <Card bg={"#3e5f74"} aspectRatio={1} cursor="pointer"
>
                                            A
                                    </Card>

                                    <Card bg={"#3e5f74"} aspectRatio={1} cursor="pointer"
>
                                            A
                                    </Card>

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
