
/**
    * Render-Methode für die Impressum-Seite.
    * @returns {JSX.Element} Das gerenderte Impressum-Element.
    * @requires chakra-ui/react
    * @requires react
    */
import React, { Component } from 'react';
import {
    Card,
    CardBody,
    Image,
    Stack,
    Heading,
    Text,
    Flex,
    Center,
} from '@chakra-ui/react';

// Impressum Seite
class Impressum extends Component {
    render() {
        return (
            <Flex
                justify='center'
                w='100%'
                p={8}
            >
                <Card
                    align={'center'}
                    justifyContent={'center'}
                    w='800px'
                    bg={'#fff'}
                    opacity={'1.0'}
                    borderRadius={'60px'}
                >
                    <CardBody opacity={'1.0'}>
                        <Flex justify='center'>
                            <Image
                                w={300}
                                h={250}
                                borderRadius='lg'
                                alt='Logo'
                                src='./clearLogo.png'
                            />
                        </Flex>
                        <Stack
                            mt='6'
                            textAlign={'center'}
                            spacing='3'
                        >
                            <Heading size='md'>Infos über uns</Heading>
                            <Center>
                                <Center
                                    display={'block'}
                                    maxW={{
                                        base: '100%',
                                        md: '95%',
                                        xl: '90%',
                                    }}
                                >
                                    <Heading
                                        mt={10}
                                        mb={1}
                                        size='sm'
                                    >
                                        Angaben gemäß § 5 TMG:
                                    </Heading>
                                    <Text>E-Paul Smart-Home</Text>
                                    <Text>Fallenbrunnen 2</Text>
                                    <Text mb={4}>88045 Friedrichshafen</Text>
                                    <Heading
                                        mt={10}
                                        mb={1}
                                        size='sm'
                                    >
                                        Kontakt:
                                    </Heading>
                                    <Text>Telefon: -</Text>
                                    <Text mb={4}>
                                        E-Mail: support@epaul-smarthome.de
                                    </Text>
                                    <Heading
                                        mt={10}
                                        mb={1}
                                        size='sm'
                                    >
                                        Vertreten durch:
                                    </Heading>
                                    <Text mb={4}>Mathias Daniel Druica</Text>
                                    <Heading
                                        mt={10}
                                        mb={1}
                                        size='sm'
                                    >
                                        Haftungsausschluss:
                                    </Heading>
                                    <Text>
                                        Trotz sorgfältiger inhaltlicher
                                        Kontrolle übernehmen wir keine Haftung
                                        für die Inhalte externer Links.
                                    </Text>
                                    <Text mb={4}>
                                        Für den Inhalt der verlinkten Seiten
                                        sind ausschließlich deren Betreiber
                                        verantwortlich.
                                    </Text>
                                    <Heading
                                        mt={10}
                                        mb={1}
                                        size='sm'
                                    >
                                        Urheberrecht:
                                    </Heading>
                                    <Text>
                                        Die durch die Seitenbetreiber erstellten
                                        Inhalte und Werke auf diesen Seiten
                                        unterliegen dem deutschen Urheberrecht.
                                    </Text>
                                    <Text>
                                        Die Vervielfältigung, Bearbeitung,
                                        Verbreitung und jede Art der Verwertung
                                        außerhalb der Grenzen{' '}
                                    </Text>
                                    <Text mb={5}>
                                        {' '}
                                        des Urheberrechtes bedürfen der
                                        schriftlichen Zustimmung des jeweiligen
                                        Autors bzw. Erstellers.
                                    </Text>
                                </Center>
                            </Center>
                        </Stack>
                    </CardBody>
                </Card>
            </Flex>
        );
    }
}
export default Impressum;
