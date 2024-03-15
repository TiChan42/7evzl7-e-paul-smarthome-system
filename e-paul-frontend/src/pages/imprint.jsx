import React, { Component } from 'react';
import {Card, CardBody, Image, Stack, Heading, Text, Flex, Box} from '@chakra-ui/react'





class Impressum extends Component {
    render() {
        return (
            <Box width="100%" display="flex" justifyContent="center" p={8}>
                <Card bg={"#fff"} opacity={"1.0"} borderRadius={"60px"} width="800px" justifyContent={"center"} align={"center"}>
                    <CardBody opacity={"1.0"}>
                        <Flex justifyContent="center">
                            <Image
                                src='./clearLogo.png'
                                alt='Logo'
                                borderRadius='lg'
                                height={250}
                                width={300}
                            />
                        </Flex>
                        <Stack mt='6' spacing='3'>
                            <Heading size='md' textAlign={"center"}>Infos über uns</Heading>
                            <Text textAlign={"center"}>
                                <strong>Angaben gemäß § 5 TMG:</strong><br />
                                E-Paul Smart-Home<br />
                                Fallenbrunnen 2<br />
                                88045 Friedrichshafen<br />
                                <br />
                                <strong>Kontakt:</strong><br />
                                Telefon: +49 152 05761819<br />
                                E-Mail: mddruica@gmail.com<br />
                                <br />
                                <strong>Vertreten durch:</strong><br />
                                Mathias Daniel Druica<br />
                                <br />
                                <strong>Haftungsausschluss:</strong><br />
                                    <p textAlign="center">Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. <br></br>Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.</p><br />
                                <br />
                                <strong>Urheberrecht:</strong><br />
                                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht.<br></br> Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen <br></br> des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
                            </Text> 
                        </Stack>
                    </CardBody>
                </Card>
            </Box>
        );
    }
}
export default Impressum;