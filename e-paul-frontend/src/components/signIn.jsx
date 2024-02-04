import React, { Component } from 'react';
import { Center, Button, Input, Text, Card, CardBody } from '@chakra-ui/react';
import { Link } from 'react-router-dom';


class SignIn extends Component {

    //check if form is in DOM
    componentDidUpdate() {
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

        fetch("http://localhost:3000/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(res => res.json())
            .then(data => console.log(data))
            .catch(error => console.log(error))
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
                            <Input type="password" name="passwordRepeat" placeholder='Passwort wiederholen' size='md' variant={"filled"} />
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
