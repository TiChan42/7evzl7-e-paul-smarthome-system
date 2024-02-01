import React, { Component } from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import './middle.css'
import './style.css'

class Middle extends Component {
    state = {  } 
    render() { 
        return (
            <Box>
                <Heading>Smart-Home-System E-Paul</Heading>
                <Text>Willkommen bei unserem innovativen Smart-Home System, das Ihr Zuhause in ein intelligentes und vernetztes Wohnerlebnis verwandelt! Unser System basiert auf dem leistungsstarken ESP-8266 Mikrocontroller, der eine zuverlässige und effiziente Steuerung ermöglicht.
                    Mit nur wenigen Schritten können Sie Ihr eigenes Konto erstellen und Ihr Zuhause personalisieren. Unser intuitives Benutzerinterface ermöglicht es Ihnen, mühelos durch verschiedene Räume zu navigieren und die Beleuchtung nach Ihren Vorlieben anzupassen. Egal, ob Sie die Helligkeit anpassen, das Licht dimmen oder bestimmte Lichtquellen aktivieren möchten.
                    Die Verbindungssicherheit steht bei uns an erster Stelle. Unser System verwendet fortschrittliche Verschlüsselungstechnologien, um sicherzustellen, dass Ihre Daten geschützt sind. Sie können sich also entspannt zurücklehnen und Ihr smartes Zuhause genießen, ohne sich um Sicherheitsbedenken sorgen zu müssen.
                    Entdecken Sie die Zukunft des Wohnens mit unserem ESP-8266 basierten Smart-Home System. Einfach zu bedienen, energieeffizient und individuell anpassbar – gestalten Sie Ihr Zuhause so, wie Sie es sich immer gewünscht haben.
                    Fragen oder Probleme? Schreiben sie uns einfach: mddruica@gmail.com
                </Text>
            </Box>
);
    };
}
 
export default Middle;
