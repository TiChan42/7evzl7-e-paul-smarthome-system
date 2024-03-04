import { Component, useEffect } from 'react';
import { Heading, Grid, Box, GridItem, Card, Center, Button, Flex, Spacer, Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, CardBody, Divider, VStack, CardHeader, Text} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons'
import AddGroupDialog from '../addGroupDialog'
import AddDeviceDialog from '../addDeviceDialog';
import OpenHistoryDrawer from '../openhistoryDrawer';
//import { decryptString } from '../../encryptionUtils';
import { LuLamp } from "react-icons/lu";
import { MdArrowForwardIos } from "react-icons/md";

function DeviceOverview() {
    //userID = decryptString(sessionStorage.getItem('executingUserID').toString());

    /*Auf die Startseite wenn nicht angemeldet
    useEffect(() => {
        if (sessionStorage.getItem("accountID") == null) {
        window.location.href = "/";
        }
    }, []);
    */

    return (
        <Box>
            <Flex pt={4} pl={4} pr={4}>
                <Heading>Mein Smart-Home</Heading>
                <Spacer></Spacer>
                <OpenHistoryDrawer></OpenHistoryDrawer>
            </Flex>

            <Box p={4}>
                <Grid
                    h='700px'
                    templateRows='repeat(2, 1fr)'
                    templateColumns='repeat(3, 1fr)'
                    gap={4}
                    >
                    <GridItem colSpan={1}>
                        <Card bg={"blue2"} w='100%' h='100%'>
                        <CardHeader>
                            <Heading size='lg' color={"white"}>Statusmeldung</Heading>
                            <Text color={"white"}></Text>

                        </CardHeader>
                        </Card>
                    </GridItem>
                    <GridItem rowSpan={2} colSpan={1}>
                        <Card bg={"blue2"} w='100%' h='100%'>
                            <CardHeader>
                                <Heading size='lg' color={"white"}>Gruppen</Heading>
                            </CardHeader>
                            <CardBody>
                                <Accordion allowToggle borderRadius='lg'>
                                    <AccordionItem>
                                        <h2>
                                        <AccordionButton background={'#3e5f74'} _hover={{bg: "#5b7a91"}}>
                                            <Box as="span" flex='1' textAlign='left' fontWeight={'bold'}>
                                                Gruppe1
                                            </Box>
                                            <AccordionIcon />
                                        </AccordionButton>
                                        </h2>
                                        <AccordionPanel pb={4} background={"#7b99a7"}>
                                            <Button mr={4}>Szene1</Button>
                                            <Button mr={4}>Szene2</Button>
                                            <Divider mt={4} mb={4} orientation='horizontal' />
                                            <Box align='end'>
                                                <Button ml={4}><EditIcon mr={2}></EditIcon> Bearbeiten </Button>
                                            </Box>
                                        </AccordionPanel>
                                    </AccordionItem>

                                    <AccordionItem>
                                        {({ isExpanded }) => (
                                        <>
                                            <h2>
                                            <AccordionButton background={'#3e5f74'} _hover={{bg: "#536f82"}}>
                                                <Box as="span" flex='1' textAlign='left' fontWeight={'bold'}>
                                                    Gruppe2
                                                </Box>
                                                <AccordionIcon />
                                            </AccordionButton>
                                            </h2>
                                            <AccordionPanel pb={4} background={"#91a3af"}>
                                            <Button mr={4}>Szene1</Button>
                                            <Button mr={4}>Szene2</Button>
                                            <Divider mt={4} mb={4} orientation='horizontal' />
                                            <Box align='end'>
                                                <Button ml={4}><EditIcon mr={2}></EditIcon>Bearbeiten </Button>
                                            </Box>
                                            </AccordionPanel>
                                        </>
                                        )}
                                    </AccordionItem>
                                </Accordion>
                            </CardBody>
                                <Box align='end' m={4}>
                                    <AddGroupDialog/>
                                </Box>
                        </Card>
                    </GridItem>
                    <GridItem rowSpan={2} colSpan={1}>
                        <Card bg={"blue2"} w='100%' h='100%'>
                            <CardHeader>
                                <Heading size='lg' color={"white"}>Meine Geräte</Heading>
                            </CardHeader>
                            <CardBody>
                                <VStack
                                    spacing={4}
                                    align='stretch'
                                    >
                                    <Card h='80px' bg='#3e5f74' color={'white'}>
                                        <Grid
                                        templateRows='repeat(1, 1fr)'
                                        templateColumns='repeat(5, 1fr)'
                                        gap={4}
                                        h="100%" 
                                        w="100%"
                                        p={2}
                                        >
                                            <GridItem colSpan={1} rowSpan={1}>
                                                <Center h="100%">
                                                    <LuLamp size={'60px'}/>
                                                </Center>
                                            </GridItem>

                                            <GridItem colSpan={3} rowSpan={1} textAlign="center">
                                                <Flex align="center"  h="100%">
                                                    <Text color={'white'} fontSize='3xl' fontWeight={'bold'}>Lampe1</Text>
                                                </Flex>
                                            </GridItem>

                                            <GridItem colSpan={1} rowSpan={1}>
                                                <Center h="100%">
                                                    <MdArrowForwardIos size={'60px'}/>
                                                </Center>
                                            </GridItem>
                                        </Grid>
                                    </Card>
                                    
                                    <Card h='80px' bg='#3e5f74' color={'white'}>
                                        <Grid
                                        templateRows='repeat(1, 1fr)'
                                        templateColumns='repeat(5, 1fr)'
                                        gap={4}
                                        h="100%" 
                                        w="100%"
                                        p={2}
                                        >
                                            <GridItem colSpan={1} rowSpan={1}>
                                                <Center h="100%">
                                                    <LuLamp size={'60px'}/>
                                                </Center>
                                            </GridItem>

                                            <GridItem colSpan={3} rowSpan={1} textAlign="center">
                                                <Flex align="center"  h="100%">
                                                    <Text color={'white'} fontSize='3xl' fontWeight={'bold'}>Lampe2</Text>
                                                </Flex>
                                            </GridItem>

                                            <GridItem colSpan={1} rowSpan={1}>
                                                <Center h="100%">
                                                    <MdArrowForwardIos size={'60px'}/>
                                                </Center>
                                            </GridItem>
                                        </Grid>
                                    </Card>

                                </VStack>
                            </CardBody>
                            <Box align='end' m={4}>
                                <AddDeviceDialog/>
                            </Box>
                        </Card>
                    </GridItem>
                    <GridItem colSpan={1}>
                        <Card bg={"blue2"} w='100%' h='100%'>
                            <CardHeader>
                                <Heading size='lg' color={"white"}>Favoriten</Heading>
                            </CardHeader>
                            <CardBody>
                            </CardBody>
                        </Card>
                    </GridItem>
                </Grid>
            </Box>
        </Box>
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