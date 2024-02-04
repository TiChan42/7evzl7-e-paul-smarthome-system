import React, { Component } from 'react';
import { Center, Button, Input, Text, Card, CardBody } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

class SignIn extends Component {
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
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
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
                
                fetch("http://localhost:3000/signUp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }).then(res => res.json())
                .then(data => console.log(data))
                .catch(error => console.log(error))
            }

            
        }
    }

    render() {
        return (
            <form className="form" onSubmit={this.handleSubmit}>
                <Center>
                    <Card size="lg" width={400}>
                        <CardBody>
                            <Text>Email</Text>
                            <Input type="email" name="email" placeholder='Email eingeben' size='md' variant={"filled"} />
                            <br />
                            <br />
                            <Text>Passwort</Text>
                            <Input type="password" name="password" placeholder='Passwort eingeben' size='md' variant={"filled"} />
                            <br />
                            <br />
                            <Text>Passwort wiederholen</Text>
                            <Input type="password" name="confirmPassword" placeholder='Passwort wiederholen' size='md' variant={"filled"} />
                            <br />
                            <Text color="red">{this.state.confirmPasswordError}</Text>
                            <Text color="red">{this.state.passwordError}</Text>
                            <Link to="/login"> Bereits registriert? </Link>
                            <br />
                        </CardBody>
                        <Center p={3}>
                            <Button type="submit" colorScheme='teal'>Anmelden</Button>
                        </Center>
                    </Card>
                </Center>
            </form>
        );
    }
}

export default SignIn;
