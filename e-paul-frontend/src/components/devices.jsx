import { Component } from "react";
import { Heading, Grid, Box, GridItem, Card, Button, Flex, Spacer, Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, CardBody, Divider, VStack, CardHeader} from "@chakra-ui/react";
import { EditIcon } from '@chakra-ui/icons'
import AddGroupDialog from "./addGroupDialog"
import AddDeviceDialog from "./addDeviceDialog";
import OpenHistoryDrawer from "./openhistoryDrawer";

class Devices extends Component {
    render() { 
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
                            <Card bg={"#218395"} w='100%' h='100%'>
                            <CardHeader>
                                <Heading size='lg' color={"white"}>Statusmeldung</Heading>
                            </CardHeader>
                            </Card>
                        </GridItem>
                        <GridItem rowSpan={2} colSpan={1}>
                            <Card bg={"#218395"} w='100%' h='100%'>
                                <CardHeader>
                                    <Heading size='lg' color={"white"}>Gruppen</Heading>
                                </CardHeader>
                                <CardBody>
                                    <Accordion allowToggle  background={"white"}>
                                        <AccordionItem>
                                            <h2>
                                            <AccordionButton>
                                                <Box as="span" flex='1' textAlign='left' fontWeight={'bold'}>
                                                    Gruppe1
                                                </Box>
                                                <AccordionIcon />
                                            </AccordionButton>
                                            </h2>
                                            <AccordionPanel pb={4}>
                                                <Button mr={4}>Szene1</Button>
                                                <Button mr={4}>Szene2</Button>
                                                <Divider mt={4} mb={4} orientation='horizontal' />
                                                <Box align='end'>
                                                    <Button ml={4}><EditIcon></EditIcon> Bearbeiten </Button>
                                                </Box>
                                            </AccordionPanel>
                                        </AccordionItem>

                                        <AccordionItem>
                                            {({ isExpanded }) => (
                                            <>
                                                <h2>
                                                <AccordionButton>
                                                    <Box as="span" flex='1' textAlign='left' fontWeight={'bold'}>
                                                        Gruppe2
                                                    </Box>
                                                    <AccordionIcon />
                                                </AccordionButton>
                                                </h2>
                                                <AccordionPanel pb={4}>
                                                <Button mr={4}>Szene1</Button>
                                                <Button mr={4}>Szene2</Button>
                                                <Divider mt={4} mb={4} orientation='horizontal' />
                                                <Box align='end'>
                                                    <Button ml={4}><EditIcon></EditIcon> Bearbeiten </Button>
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
                            <Card bg={"#218395"} w='100%' h='100%'>
                                <CardHeader>
                                    <Heading size='lg' color={"white"}>Meine Geräte</Heading>
                                </CardHeader>
                                <CardBody>
                                    <VStack
                                        spacing={4}
                                        align='stretch'
                                        >
                                        <Box h='40px' bg='yellow.200'>
                                            1
                                        </Box>
                                        <Box h='40px' bg='tomato'>
                                            2
                                        </Box>
                                        <Box h='40px' bg='pink.100'>
                                            3
                                        </Box>
                                    </VStack>
                                </CardBody>
                                <Box align='end' m={4}>
                                    <AddDeviceDialog/>
                                </Box>
                            </Card>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <Card bg={"#218395"} w='100%' h='100%'>
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
        );

    }

}

export default Devices;