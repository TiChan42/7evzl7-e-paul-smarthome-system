import React, { Component } from 'react';
import { Box, Heading, Text, Card, CardBody, Image, Button, Stack, Center, Flex, Spacer } from '@chakra-ui/react';


class Welcome extends Component {
    state = {  } 
    render() { 
        return (
            <Box paddingLeft={"10%"} paddingRight={"10%"}>
                <Text textAlign={"center"} fontSize={'2xl'}>
                    Unser innovatives Smart-Home System verwandelt Ihr Zuhause in ein intelligentes und vernetztes Wohnerlebnis.
                </Text>
                <Text textAlign={"center"} fontSize={'xl'}>
                    <br/> Entdecken Sie die Zukunft des Wohnens mit E-Paul!
                    <br/> Einfach zu bedienen, energieeffizient und individuell anpassbar <br/> – <br/> gestalten Sie Ihr Zuhause so, wie Sie es sich immer gewünscht haben.
                </Text>
                <br/>

                <Flex>
        <Card maxW='sm' boxShadow={"xl"} borderRadius='lg'>
            <CardBody>
                <Image
                src='https://upload.wikimedia.org/wikipedia/commons/8/84/ESP-01.jpg'
                alt='Green double couch with wooden legs'
                height={250}
                width={350}
                borderRadius='lg'
                />
                <Stack mt='6' spacing='3'>
                <Heading size='md' textAlign={"center"}>Esp-8266</Heading>
                <Text>
                    Unser System basiert auf dem leistungsstarken ESP-8266 Mikrocontroller, 
                    der eine zuverlässige und effiziente Steuerung ermöglicht. <br/>
                    Die Smart-Home Geräte und Mikrocontroller werden zu Modulen zusammengeschlossen.<br/>
                    So lassen sich alle Geräte vom Interface steuern.
                </Text>
                </Stack>
            </CardBody>
            <Center p={"3"}>
                <Button variant='solid' colorScheme='blue'>
                    mehr erfahren
                </Button>
            </Center>
        </Card>
        <Spacer/>
        <Card maxW='sm' boxShadow={"xl"} borderRadius='lg'>
            <CardBody>
                <Image
                src='https://img.freepik.com/free-vector/wireframing-concept-illustration_114360-1388.jpg?w=1060&t=st=1706867836~exp=1706868436~hmac=d3142fc993e8e55b9018507c8238e315a5f1c01f7d54f8f8e29adaf069952406'
                alt='Green double couch with wooden legs'
                borderRadius='lg'
                height={250}
                width={350}
                />
                <Stack mt='6' spacing='3'>
                <Heading size='md' textAlign={"center"}>Benutzerinterface</Heading>
                <Text>
                    Unser intuitives Benutzerinterface ermöglicht es Ihnen, mühelos durch verschiedene Räume zu navigieren und ihre Smart-Home Geräte nach Ihren Vorlieben anzupassen. <br/>
                    Sie können bestimmte Lichtquellen an- und ausschlaten, sowie deren Helligkeit anpassen.
                </Text>
                </Stack>
            </CardBody>
            <Center p={"3"}>
                <Button variant='solid' colorScheme='blue'>
                    mehr erfahren
                </Button>
            </Center>
        </Card>
        <Spacer/>
        <Card maxW='sm' boxShadow={"xl"} borderRadius='lg'>
            <CardBody>
                    <Image
                    src='https://img.freepik.com/free-photo/hand-holding-cloud-system-with-data-protection_53876-124620.jpg?w=1800&t=st=1706868856~exp=1706869456~hmac=9a07bee265e3315cdca8cc859c6183e648543528abef1badf92f9913211fe70b'
                    alt='Green double couch with wooden legs'
                    borderRadius='lg'
                    height={250}
                    width={350}
                    />
                    <Stack mt='6' spacing='3'>
                    <Heading size='md' textAlign={"center"}>Sicherheit</Heading>
                    <Text>
                        Die Verbindungssicherheit steht bei uns an erster Stelle. <br/>
                        Deshalb verwendet unser System fortschrittliche Verschlüsselungstechnologien, um die Sicherheit ihrer Daten zu gewährleisten <br/>
                        So können Sie sich entspannt zurücklehnen und Ihr smartes Zuhause genießen.
                    </Text>
                    </Stack>
            </CardBody>
                <Center p={"3"}>
                    <Button variant='solid' colorScheme='blue'>
                        mehr erfahren
                    </Button>
                </Center>
            </Card>
        </Flex>

                <br/>
                <Text fontSize={"xl"}>
                    Fragen oder Probleme? Schreiben sie uns: <a href = "mailto: mddruica@gmail.com">mddruica@gmail.com</a>  
                </Text>
            </Box>
        );
    };
}

export default Welcome;
