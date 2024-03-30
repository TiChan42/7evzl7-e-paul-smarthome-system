
import React, { Component } from 'react';
import { Box, Heading, Text, Center } from '@chakra-ui/react';
import SlideShow from '../components/carousel';

/**
 * Zeigt die Willkommensseite an.
 */
class Welcome extends Component {
    state = {};

    /**
     * Render-Methode der Willkommensseite.
     * @returns {JSX.Element} Willkommensseite
     */
    render() {
        return (
            <Center>
                <Box w={{ base: '100%', sm: '85%', xl: '80%', '2xl': '75%' }}>
                    <Heading
                        pt={20}
                        fontSize={'3xl'}
                        textAlign={'center'}
                    >
                        Willkommen bei E-Paul
                    </Heading>
                    <Text
                        fontSize={'xl'}
                        textAlign={'center'}
                    >
                        <br /> Entdecken Sie die Zukunft des Wohnens und
                        gestalten Sie Ihr Zuhause so, wie Sie es sich immer
                        gewünscht haben.
                        <br /> Denn unser innovatives Smart-Home System
                        ermöglicht ihnen ein intelligentes und vernetztes
                        Wohnerlebnis.
                    </Text>
                    <br />

                    <SlideShow slides={slides} />
                </Box>
            </Center>
        );
    }
}

export default Welcome;
