import React, { Component } from 'react';
import {Card, CardBody, Image, Stack, Heading, Text, Flex, Box, Center} from '@chakra-ui/react'





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
                        <Stack mt='6' spacing='3' textAlign={'center'}>
                            <Heading size='md'>Infos über uns</Heading>
                            <Center>
                                <Center maxW={{base:'100%', md:'95%', xl:'90%'}} display={'block'}>
                                    <Heading size='sm' mb={1} mt={10}>Angaben gemäß § 5 TMG:</Heading>
                                    <Text>E-Paul Smart-Home</Text>
                                    <Text>Fallenbrunnen 2</Text>
                                    <Text mb={4}>88045 Friedrichshafen</Text>
                                    <Heading size='sm' mb={1} mt={10}>Kontakt:</Heading>
                                    <Text>Telefon: -</Text>
                                    <Text mb={4}>E-Mail: support@epaul-smarthome.de</Text>
                                    <Heading size='sm' mb={1} mt={10}>Vertreten durch:</Heading>
                                    <Text mb={4}>Mathias Daniel Druica</Text>
                                    <Heading size='sm' mb={1} mt={10}>Haftungsausschluss:</Heading>
                                    <Text>Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links.</Text>
                                    <Text mb={4}>Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.</Text>
                                    <Heading size='sm' mb={1} mt={10}>Urheberrecht:</Heading>
                                    <Text>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht.</Text>
                                    <Text>Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen </Text>
                                    <Text mb={5}> des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.</Text>         
                                </Center> 
                            </Center>
                        </Stack>
                    </CardBody>
                </Card>
            </Box>
        );
    }
}
export default Impressum;