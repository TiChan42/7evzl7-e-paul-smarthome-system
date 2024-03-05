import React, { Component } from 'react';
import { Box, Heading, Text, Center } from '@chakra-ui/react';
import SlideShow from "../carousel";

const slides = [
    {
        title: "Hardware",
        text: "Unser System basiert auf dem leistungsstarken ESP-8266 Mikrocontroller, der eine zuverlässige und effiziente Steuerung ermöglicht. Die Smart-Home Geräte und Mikrocontroller werden zu Modulen zusammengeschlossen. Darüber lassen sich dann alle Geräte vom Interface steuern.",
        image: "../../assets/img/welcome_images/micro-controller.svg",
    },
    {
        title: "Benutzerinterface",
        text: "Unser intuitives Benutzerinterface ermöglicht es Ihnen, mühelos durch die Räume ihres Hauses zu navigieren und ihre Smart-Home Geräte nach ihren Vorlieben anzupassen. Sie können zB bestimmte Lichter an- und ausschalten, sowie deren Helligkeit anpassen.",
        image: "../../assets/img/welcome_images/user-interface.svg"
    },
    {
        title: "Sicherheit",
        text: "Die Verbindungssicherheit steht bei uns an erster Stelle. Deshalb verwendet unser System fortschrittliche Verschlüsselungstechnologien, um die Sicherheit ihrer wichtigen Daten zu gewährleisten. So können Sie sich entspannt zurücklehnen und sorgenlos Ihr smartes Zuhause genießen.",
        image: "../../assets/img/welcome_images/cyber-security.svg"
    },
    {
        title: "Shop",
        text: "In unserem Shop finden Sie eine große Auswahl an Smart-Home Geräten, die Sie ganz einfach in Ihr System integrieren können. Von intelligenten Glühbirnen bis hin zu vernetzten Steckdosen - bei uns finden Sie alles, was Sie für Ihr Smart-Home benötigen.",
        image: "../../assets/img/team.svg",
        button: {
            text: "zum Shop",
            onClick: () => {console.log("zum Shop"); alert("Der Shop ist leider noch nicht verfügbar.")}
        }
    }
]
class Welcome extends Component {
    state = {  } 
    render() { 
        return (
            <Center>
            <Box width={{base: '100%', sm: '85%', xl: '80%', '2xl':'75%'}}>
                <Heading textAlign={"center"} fontSize={'3xl'} pt={20}>Willkommen bei E-Paul</Heading>
                <Text textAlign={"center"} fontSize={'xl'}>
                    <br/> Entdecken Sie die Zukunft des Wohnens und gestalten Sie Ihr Zuhause so, wie Sie es sich immer gewünscht haben.
                    <br/> Denn unser innovatives Smart-Home System ermöglicht ihnen ein intelligentes und vernetztes Wohnerlebnis.
                </Text>
                <br/>
                
                <SlideShow slides={slides}/>

            </Box>
            </Center>
        );
    };
}

export default Welcome;
