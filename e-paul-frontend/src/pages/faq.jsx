
import React, { Component } from 'react';
import {
    Box,
    Accordion,
    AccordionIcon,
    AccordionButton,
    AccordionPanel,
    AccordionItem,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Flex,
} from '@chakra-ui/react';

/**
 * Komponente für die FAQ-Seite.
 */
class FAQ extends Component {
    /**
     * Erzeugt eine Instanz der FAQ-Komponente.
     */
    constructor(props) {
        super(props);

        /**
         * Der aktive Tab.
         * @type {string}
         */
        this.state = { activeTab: 'faq' };
    }

    /**
     * Render-Methode der FAQ-Komponente.
     * @returns {JSX.Element} Das gerenderte JSX-Element.
     */
    render() {
        const { activeTab } = this.state;

        return (
            <Tabs>
                <Flex>
                    <Box w='20%' mr={4}>
                        <TabList>
                            <Tab
                                onClick={() =>
                                    this.setState({ activeTab: 'faq' })
                                }
                            >
                                FAQ
                            </Tab>
                            <Tab
                                onClick={() =>
                                    this.setState({ activeTab: 'contact' })
                                }
                            >
                                Kontakt
                            </Tab>
                        </TabList>
                    </Box>
                    <Box w='80%'>
                        <TabPanels>
                            <TabPanel>
                                {activeTab === 'faq' && (
                                    <Accordion allowMultiple>
                                        <AccordionItem>
                                            <h2>
                                                <AccordionButton>
                                                    <Box
                                                        as='span'
                                                        flex='1'
                                                        textAlign='left'
                                                    >
                                                        Wie verbinde ich mich
                                                        mit dem Esp8266?
                                                    </Box>
                                                    <AccordionIcon />
                                                </AccordionButton>
                                            </h2>
                                            <AccordionPanel pb={4}>
                                                Lorem ipsum dolor sit amet,
                                                consectetur adipiscing elit, sed
                                                do eiusmod tempor incididunt ut
                                                labore et dolore magna aliqua.
                                                Ut enim ad minim veniam, quis
                                                nostrud exercitation ullamco
                                                laboris nisi ut aliquip ex ea
                                                commodo consequat.
                                            </AccordionPanel>
                                        </AccordionItem>

                                        <AccordionItem variant='second'>
                                            <h2>
                                                <AccordionButton>
                                                    <Box
                                                        as='span'
                                                        flex='1'
                                                        textAlign='left'
                                                    >
                                                        Wie ändere ich meinen
                                                        Account zu Admin?
                                                    </Box>
                                                    <AccordionIcon />
                                                </AccordionButton>
                                            </h2>
                                            <AccordionPanel pb={4}>
                                                Lorem ipsum dolor sit amet,
                                                consectetur adipiscing elit, sed
                                                do eiusmod tempor incididunt ut
                                                labore et dolore magna aliqua.
                                                Ut enim ad minim veniam, quis
                                                nostrud exercitation ullamco
                                                laboris nisi ut aliquip ex ea
                                                commodo consequat.
                                            </AccordionPanel>
                                        </AccordionItem>

                                        <AccordionItem>
                                            <h2>
                                                <AccordionButton>
                                                    <Box
                                                        as='span'
                                                        flex='1'
                                                        textAlign='left'
                                                    >
                                                        Wie viele E-Paul User
                                                        gibt es?
                                                    </Box>
                                                    <AccordionIcon />
                                                </AccordionButton>
                                            </h2>
                                            <AccordionPanel pb={4}>
                                                Lorem ipsum dolor sit amet,
                                                consectetur adipiscing elit, sed
                                                do eiusmod tempor incididunt ut
                                                labore et dolore magna aliqua.
                                                Ut enim ad minim veniam, quis
                                                nostrud exercitation ullamco
                                                laboris nisi ut aliquip ex ea
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
                </Flex>
            </Tabs>
        );
    }
}

export default FAQ;
