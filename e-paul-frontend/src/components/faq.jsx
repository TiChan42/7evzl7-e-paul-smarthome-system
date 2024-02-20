import React, { Component } from 'react';
import { Box, Accordion, AccordionIcon, AccordionButton, AccordionPanel, AccordionItem, Tab, TabList, TabPanel, TabPanels } from '@chakra-ui/react'

class FAQ extends Component {
    state = { activeTab: 'faq' };

    render() {
        const { activeTab } = this.state;

        return (
            <Box display="flex">
                <Box width="20%" marginRight={4}>
                    <TabList>
                        <Tab onClick={() => this.setState({ activeTab: 'faq' })}>FAQ</Tab>
                        <Tab onClick={() => this.setState({ activeTab: 'contact' })}>Kontakt</Tab>
                    </TabList>
                </Box>
                <Box width="80%">
                    <TabPanels>
                        <TabPanel>
                            {activeTab === 'faq' && (
                                <Accordion>
                                    <AccordionItem>
                                        <h2>
                                            <AccordionButton>
                                                <Box as="span" flex='1' textAlign='left' color={"rgba(33, 131, 149)"}>
                                                    Wie verbinde ich mich mit dem Esp8266?
                                                </Box>
                                                <AccordionIcon />
                                            </AccordionButton>
                                        </h2>
                                        <AccordionPanel pb={4}>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                                            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                            commodo consequat.
                                        </AccordionPanel>
                                    </AccordionItem>

                                    <AccordionItem>
                                        <h2>
                                            <AccordionButton>
                                                <Box as="span" flex='1' textAlign='left' color={"rgba(33, 131, 149, .8)"}>
                                                    Wie ändere ich meinen Account zu Admin?
                                                </Box>
                                                <AccordionIcon />
                                            </AccordionButton>
                                        </h2>
                                        <AccordionPanel pb={4}>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                                            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                            commodo consequat.
                                        </AccordionPanel>
                                    </AccordionItem>

                                    <AccordionItem>
                                        <h2>
                                            <AccordionButton>
                                                <Box as="span" flex='1' textAlign='left' color={"rgba(33, 131, 149, .6)"}>
                                                    Wie viele E-Paul User gibt es?
                                                </Box>
                                                <AccordionIcon />
                                            </AccordionButton>
                                        </h2>
                                        <AccordionPanel pb={4}>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                                            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                            commodo consequat.
                                        </AccordionPanel>
                                    </AccordionItem>
                                </Accordion>
                            )}
                        </TabPanel>
                        <TabPanel>
                            {activeTab === 'contact' && (
                                <div>
                                    Hier sind die Kontaktinformationen.
                                </div>
                            )}
                        </TabPanel>
                    </TabPanels>
                </Box>
            </Box>
        );
    }
}

export default FAQ;
