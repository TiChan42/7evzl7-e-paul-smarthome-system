import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './login.css'
import { Center, Button, Input, Text, InputGroup, InputRightElement, Card, CardBody } from '@chakra-ui/react';

function PasswordInput() {
    const [show, setShow] = React.useState(false)
    const handleClick = () => setShow(!show)
    
    return (
      <InputGroup size='md'>
        <Input
          pr='4.5rem'
          type={show ? 'text' : 'password'}
          placeholder='Passwort eingeben'
          variant={"filled"}
          size='md'
        />
        <InputRightElement width='4.5rem'>
          <Button h='1.75rem' size='md' onClick={handleClick}>
            {show ? 'Hide' : 'Show'}
          </Button>
        </InputRightElement>
      </InputGroup>
    )
  }

class Login extends Component {
    state = {  } 
    render() { 
        return (
            <Center m={'50px'}>
                <Card size="lg" width={400} bg={"#218395"} p={"50px"}>
                    <CardBody>
                        <Text>Email</Text>   
                        <Input placeholder='Email eingeben' size='md' variant={"filled"}/>
                        <br/>
                        <br/>
                        <Text>Passwort</Text>   
                        <PasswordInput />
                        <Link to="/signin"> Jetzt registieren! </Link>
                        <br/>
                    </CardBody>
                    <Center p={3}>
                    <Link to="/chooseuser">
                        <Button colorScheme='teal'>Anmelden</Button>
                    </Link>
                    </Center>
                </Card>
            </Center>  
        );
    }
}
 
export default Login;