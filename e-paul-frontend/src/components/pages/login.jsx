import React, { Component } from 'react';
import { Link } from 'react-router-dom';
//import './login.css'
import { Center, Button, Card, Input, Text, InputGroup, InputRightElement } from '@chakra-ui/react';

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

    constructor(props) {
      super(props);
      this.state = {
          passwordError: "" //empty Strings of Errormessage
      };
  }
    
    //check if form is in DOM
    componentDidMount() {
      const formEl = document.querySelector(".form");
      if (formEl) {
          formEl.addEventListener("submit", this.handleSubmit);
      }
  }
  
  //POST the content of form as JSON
  handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    console.log(data);

    if (true) {
        this.setState({ passwordError: "" }); //reset error message
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }

        fetch("http://epaul-smarthome.de:8000/api/login", requestOptions)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.log(error))
    } else {
        this.setState({ passwordError: "Login failed" });
    }
  }
    render() { 
      return (
        <Center p={8}>
        <form onSubmit={this.handleSubmit}>
          <Card p={8} size={"md"}>
            <Text>Email</Text>
              <Input type="email" name="email" placeholder='Email eingeben' size='md' variant={"filled"} color="black"/>
              <br />
              <br />
              <Text>Passwort</Text>
              <Input type="password" name="password" placeholder='Passwort eingeben' size='md' variant={"filled"} color="black"/>
              <br />
              <Text color="red">{this.state.passwordError}</Text>
              <Link to="/register"> Jetzt registieren! </Link>
              <br />
              <Center p={3}>
                  <Button type="submit" colorScheme='teal'>Anmelden</Button>
              </Center>
            </Card>
        </form>
        </Center>
      );
    }
}
 
export default Login;