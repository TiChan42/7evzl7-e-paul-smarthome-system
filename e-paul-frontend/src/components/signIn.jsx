import React, { Component } from 'react';
import { Center, Button, Input, Text, Card, CardBody } from '@chakra-ui/react';
import { Link } from 'react-router-dom';


class SignIn extends Component {
    render() { 
        return (
            <Center>
                <Card size="lg" width={400}>
                    <CardBody>
                        <Text>Email</Text>   
                        <Input placeholder='Email eingeben' size='md' variant={"filled"}/>
                        <br/>
                        <br/>
                        <Text>Passwort</Text>   
                        <Input placeholder='Passwort eingeben' size='md' variant={"filled"}/>
                        <br/>
                        <br/>
                        <Text>Passwort wiederholen</Text>   
                        <Input placeholder='Passwort wiederholen' size='md' variant={"filled"}/>
                        <Link to="/login"> Bereits registriert? </Link>
                        <br/>
                    </CardBody>
                    <Center p={3}>
                        <Button colorScheme='teal'>Anmelden</Button>
                    </Center>
                </Card>
            </Center>
        );
    }
}

export default SignIn;
