import React, { Component } from 'react';
import { Center, Button, Input, Text, InputGroup, InputRightElement, Card, CardBody } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //empty Strings of Errormessages
            confirmPasswordError: "",
            passwordError: ""
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

    //POST the content of form as JSON
    handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);
        console.log(data);

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

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <Text>Email</Text>
                <Input type="email" name="email" placeholder='Email eingeben' size='md' variant={"filled"} color="black"/>
                <br />
                <br />
                <Text>Passwort</Text>
                <Input type="password" name="password" placeholder='Passwort eingeben' size='md' variant={"filled"} color="black"/>
                <br />
                <br />
                <Text>Passwort wiederholen</Text>
                <Input type="password" name="confirmPassword" placeholder='Passwort wiederholen' size='md' variant={"filled"} color="black"/>
                <br />
                <Text color="red">{this.state.confirmPasswordError}</Text>
                <Text color="red">{this.state.passwordError}</Text>
                <Link to="/login"> Bereits registriert? </Link>
                <br />
                <Center p={3}>
                    <Button type="submit" colorScheme='teal'>Registrieren</Button>
                </Center>
            </form>
        );
    }
}

export default Register;
