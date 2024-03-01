import React, { Component } from 'react';
import { Link as ReactRouterLink } from 'react-router-dom'
import { Link as ChakraLink } from '@chakra-ui/react'
import { Center, Button, Card, Input, Text, InputGroup, InputRightElement } from '@chakra-ui/react';
import { encryptString, decryptString } from '../../encryptionUtils';

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
      this.inputRefEmail = React.createRef();
      this.inputRefPassword = React.createRef();
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

  isInputEmpty(){
    if (this.inputRefEmail.current.value.trim() === "") {
      console.log("Input of Email is empty");
      this.setState({ passwordError: "Anmeldung fehlgeschlagen: \nEmail wurde nicht eingegeben" });
      return true;
    }else if (this.inputRefPassword.current.value.trim() === "") {
      console.log("Input of Password is empty");
      this.setState({ passwordError: "Anmeldung fehlgeschlagen:\nPasswort wurde nicht eingegeben" });
      return true;
    }else{
      this.setState({ passwordError: "" });
      return false;
    }

  }
  
  //POST the content of form as JSON
  handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    console.log(data);

    this.setState({ passwordError: "" }); //reset error message

   
    if(!this.isInputEmpty()){
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }

        fetch("http://epaul-smarthome.de:8000/api/login", requestOptions)
        .then(response => {
          console.log(response); // HTTP-Response ausgeben
          return response.json();})
        .then(data => {
          console.log(data);
          if(data["falseEmailPassword"] == 0){
            this.setState({ passwordError: "Email oder Passwort ist falsch" });
          }else{
            console.log(data["id"])
            sessionStorage.setItem('accountID', encryptString(data["id"].toString()));
            console.log("Session: "+sessionStorage.getItem("accountID"))
            window.location.href = "/chooseuser";
          }
        })
        .catch(error => console.log(error))
    }

  }
    render() { 
      return (
        <Center p={8}>
        <form onSubmit={this.handleSubmit}>
          <Card p={8} borderRadius={"32px"} bg={'#218395'}>
            <Text color={'white'}>Email</Text>
              <Input 
                type="email" 
                name="email" 
                placeholder='Email eingeben' 
                size='md' 
                variant={"filled"} 
                color="black"
                _focusVisible={{
                  bg: "gray.300",
                  borderColor: "teal.300",
                }}
                ref={this.inputRefEmail} 
              />
              <br />
              <br />
              <Text color={'white'}>Passwort</Text>
              <Input 
                type="password" 
                name="password" 
                placeholder='Passwort eingeben' 
                size='md' 
                variant={"filled"} 
                color="black"
                _focusVisible={{
                  bg: "gray.300",
                  borderColor: "teal.300",
                }}
                ref={this.inputRefPassword}  
              />
              <br />
              <Text color="red">{this.state.passwordError}</Text>
              <ChakraLink as={ReactRouterLink} to="/register" color={'white'}> Jetzt registieren! </ChakraLink>
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