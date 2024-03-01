import React, { Component, useRef } from 'react';
import { Link as ReactRouterLink } from 'react-router-dom'
import { Link as ChakraLink } from '@chakra-ui/react'
import { Center, Button, Input, Text, Card } from '@chakra-ui/react';

class Register extends Component {
    constructor(props) {
        super(props);
        this.inputRefEmail = React.createRef();
        this.inputRefPassword = React.createRef();
        this.inputRefPasswordRepeat = React.createRef();
        this.state = {
            //empty Strings of Errormessages
            confirmPasswordError: "",
            passwordError: "",
            emptyInputError: ""
        };
    }

    //check if form is in DOM
    componentDidMount() {
        const formEl = document.querySelector(".form");
        if (formEl) {
            formEl.addEventListener("submit", this.handleSubmit);
        }
    }

    //Regular expression to check password
    validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^&_*+\-=~`|\\/:;,.<>,])([A-Za-z\d@$!%*?&#^&_*+\-=~`|\\/:;,.<>,]){8,}$/;
        return passwordRegex.test(password);
    }

    isInputEmpty(){
        if (this.inputRefEmail.current.value.trim() === "") {
          console.log("Input of Email is empty");
          this.setState({ emptyInputError: "Registrierung fehlgeschlagen: \nEmail wurde nicht eingegeben" });
          return true;
        }else if (this.inputRefPassword.current.value.trim() === "") {
          console.log("Input of Password is empty");
          this.setState({ emptyInputError: "Registrierung fehlgeschlagen:\nPasswort wurde nicht eingegeben" });
          return true;
        }else if (this.inputRefPasswordRepeat.current.value.trim() === "") {
            console.log("Input of Password Repeat is empty");
            this.setState({ emptyInputError: "Registrierung fehlgeschlagen:\nPasswort Wiederholen wurde nicht eingegeben" });
            return true;
        }else{
          this.setState({ emptyInputError: "" });
          return false;
        }
    
      }

    //POST the content of form as JSON
    handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);
        console.log(data);

        if(!this.isInputEmpty()){
            if (data.password !== data.confirmPassword) {
                this.setState({ confirmPasswordError: "Die Passwörter stimmen nicht überein." });
            } else {
                this.setState({ confirmPasswordError: "" }); //reset error message

                if (!this.validatePassword(data.password)) {
                    this.setState({ passwordError: "Das Passwort muss mindestens 8 Zeichen lang sein, einen kleinen Buchstaben, einen großen Buchstaben, eine Zahl und ein Sonderzeichen enthalten." });
                    return;
                } else {
                    this.setState({ passwordError: "" }); //reset error message
                    const requestOptions = {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(data)
                    }

                    fetch("http://epaul-smarthome.de:8000/api/signUp", requestOptions)
                    .then(response => response.json())
                    .then(data => console.log(data))
                    .catch(error => console.log(error))
                }   
            } 
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
                        <br />
                        <Text color={'white'}>Passwort wiederholen</Text>
                        <Input 
                            type="password" 
                            name="confirmPassword" 
                            placeholder='Passwort wiederholen' 
                            size='md' 
                            variant={"filled"} 
                            color="black"
                            _focusVisible={{
                                bg: "gray.300",
                                borderColor: "teal.300",
                            }}
                            ref={this.inputRefPasswordRepeat}   
                        />
                        <br />
                        <Text color="red">{this.state.confirmPasswordError}</Text>
                        <Text color="red">{this.state.passwordError}</Text>
                        <Text color="red">{this.state.emptyInputError}</Text>
                        <ChakraLink as={ReactRouterLink} to={"/login"} color={'white'}> Bereits registriert? </ChakraLink>
                        <br />
                        <Center p={3}>
                            <Button type="submit" colorScheme='teal'>Registrieren</Button>
                        </Center>
                    </Card>
                </form>
            </Center>
        );
    }
}

export default Register;
