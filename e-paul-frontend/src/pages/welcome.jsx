import React, { Component } from 'react';
import { Box, Heading, Text, Center } from '@chakra-ui/react';
import SlideShow from '../components/carousel';

const slides = [
    {
        title: 'Shop',
        text: 'In unserem Shop finden Sie eine große Auswahl an Smart-Home Geräten, die Sie ganz einfach in Ihr System integrieren können. Von intelligenten Glühbirnen bis hin zu vernetzten Steckdosen - bei uns finden Sie alles, was Sie für Ihr Smart-Home benötigen.',
        image: '../../assets/img/team.svg',
        button: {
            text: 'zum Shop',
            onClick: () => {
                console.log('zum Shop');
                alert('Der Shop ist leider noch nicht verfügbar.');
            },
        },
    },
    {
        title: 'Neu bei E-Paul?',
        text: 'Registrieren Sie sich jetzt kostenlos und entdecken Sie die Vorteile eines Smart-Home Systems. Mit E-Paul können Sie Ihr Zuhause ganz einfach steuern und an Ihre Bedürfnisse anpassen. Registrieren Sie sich jetzt und erleben Sie die Zukunft des Wohnens.',
        image: '../../assets/img/team2.svg',
    },
    {
        title: 'Hardware',
        text: 'Unser System basiert auf dem leistungsstarken ESP-8266 Mikrocontroller, der eine zuverlässige und effiziente Steuerung ermöglicht. Die Smart-Home Geräte und Mikrocontroller werden zu Modulen zusammengeschlossen. Darüber lassen sich dann alle Geräte vom Interface steuern.',
        image: '../../assets/img/welcome_images/micro-controller.svg',
    },
    {
        title: 'Benutzerinterface',
        text: 'Unser intuitives Benutzerinterface ermöglicht es Ihnen, mühelos durch die Räume ihres Hauses zu navigieren und ihre Smart-Home Geräte nach ihren Vorlieben anzupassen. Sie können zB bestimmte Lichter an- und ausschalten, sowie deren Helligkeit anpassen.',
        image: '../../assets/img/welcome_images/user-interface.svg',
    },
];

//Zeigt die Willkommensseite an
class Welcome extends Component {
    state = {};
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
