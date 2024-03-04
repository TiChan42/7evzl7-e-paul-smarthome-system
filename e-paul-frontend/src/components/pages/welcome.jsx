import React, { Component } from 'react';
import { Box, Heading, Text, Card, CardBody, Image, Button, Stack, Center, Flex, Spacer } from '@chakra-ui/react';


class Welcome extends Component {
    state = {  } 
    render() { 
        return (
            <Box paddingLeft={"10%"} paddingRight={"10%"}>
                <Text textAlign={"center"} fontSize={'2xl'}>
                    <br/> Entdecken Sie die Zukunft des Wohnens und gestalten Sie Ihr Zuhause so, wie Sie es sich immer gewünscht haben.
                    <br/> Denn unser innovatives Smart-Home System ermöglicht ihnen ein intelligentes und vernetztes Wohnerlebnis.
                </Text>

                <br/>

                <Flex>
                    <Card maxW='sm' boxShadow={"xl"} borderRadius={"32px"} bg={"rgba(33, 131, 149, .8)"} >
                        <CardBody>
                            <Image
                            src='../../assets/img/welcome_images/micro-controller.svg'
                            alt='Microcontroller-Bild'
                            height={250}
                            width={350}
                            borderRadius='lg'
                            />
                            <Stack mt='6' spacing='3'>
                            <Heading size='md' textAlign={"center"}>Hardware</Heading>
                            <Text>
                                Unser System basiert auf dem leistungsstarken ESP-8266 Mikrocontroller, 
                                der eine zuverlässige und effiziente Steuerung ermöglicht. <br/>
                                Die Smart-Home Geräte und Mikrocontroller werden zu Modulen zusammengeschlossen.<br/>
                                Darüber lassen sich dann alle Geräte vom Interface steuern.
                            </Text>
                            </Stack>
                        </CardBody>
                        <Center p={"3"}>
                            <Button variant='solid' colorScheme='whiteAlpha'>
                                mehr erfahren
                            </Button>
                        </Center>
                    </Card>
                    <Spacer/>
                    <Card maxW='sm' boxShadow={"xl"} borderRadius={"32px"} bg={"rgba(33, 131, 149, .8)"} >
                        <CardBody>
                            <Image
                            src='../../assets/img/welcome_images/user-interface.svg'
                            alt='User-Interface-Bild'
                            borderRadius='lg'
                            height={250}
                            width={350}
                            />
                            <Stack mt='6' spacing='3'>
                            <Heading size='md' textAlign={"center"}>Benutzerinterface</Heading>
                            <Text>
                                Unser intuitives Benutzerinterface ermöglicht es Ihnen, mühelos durch die Räume ihres Hauses zu navigieren und ihre Smart-Home Geräte nach ihren Vorlieben anzupassen. <br/>
                                Sie können zB bestimmte Lichter an- und ausschalten, sowie deren Helligkeit anpassen.
                            </Text>
                            </Stack>
                        </CardBody>
                        <Center p={"3"}>
                            <Button variant='solid' colorScheme='whiteAlpha'>
                                mehr erfahren
                            </Button>
                        </Center>
                    </Card>
                    <Spacer/>
                    <Card maxW='sm' boxShadow={"xl"} borderRadius={"32px"} bg={"rgba(33, 131, 149, .8)"} >
                        <CardBody>
                                <Image
                                src='../../assets/img/welcome_images/cyber-security.svg'
                                alt='It-Sicherheit-Bild'
                                borderRadius='lg'
                                height={250}
                                width={350}
                                />
                                <Stack mt='6' spacing='3'>
                                <Heading size='md' textAlign={"center"}>Sicherheit</Heading>
                                <Text>
                                    Die Verbindungssicherheit steht bei uns an erster Stelle. <br/>
                                    Deshalb verwendet unser System fortschrittliche Verschlüsselungstechnologien, um die Sicherheit ihrer wichtigen Daten zu gewährleisten <br/>
                                    So können Sie sich entspannt zurücklehnen und sorgenlos Ihr smartes Zuhause genießen.
                                </Text>
                                </Stack>
                        </CardBody>
                        <Center p={"3"}>
                            <Button variant='solid' colorScheme='whiteAlpha'>
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
