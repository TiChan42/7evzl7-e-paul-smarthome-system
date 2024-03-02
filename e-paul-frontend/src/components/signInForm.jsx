import {
    Button,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    InputGroup,
    InputRightElement,
    useToast,
    Heading
  } from '@chakra-ui/react'
  import React, { useState, useEffect } from 'react';
  import { encryptString} from '../encryptionUtils';
  import { ViewIcon, ViewOffIcon} from '@chakra-ui/icons'
  import {env} from '../env';

  //Form for signing in
const SignInForm = (props) => {
    const toast = useToast()

    //Indikator ob das Passwort angezeigt werden soll
    const [showPassword, setShowPassword] = React.useState(false)
    const handlePasswordShowClick = () => setShowPassword(!showPassword)

    //Eingabefelder
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    //Indikator ob der Erstellen-Button angezeigt werden soll
    const [showCreateButton, setShowCreateButton] = useState(false);

    //Überprüft ob die E-Mail-Adresse und das Passwort gültig sind
    const checkEmail = (email) => { 
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    //E-Mail-Überprüfungs Flags
    const [emailWrongFormat, setEmailWrongFormat] = useState(false);
    const [wrongEmailOrPassword, setWrongEmailOrPassword] = useState(false);
    useEffect(() => {setWrongEmailOrPassword(false)}, [email,password]);

    

    //Überprüfungs-Flags werden zusammengefasst
    const isEmailError = (emailWrongFormat || wrongEmailOrPassword);
    const isPasswordError = (wrongEmailOrPassword);

    //Überprüft ob die Eingaben korrekt sind und setzt die Flags
    useEffect(() => {
        setEmailWrongFormat(false);
        setWrongEmailOrPassword(false);

        if (email.length > 0) {
            if (checkEmail(email)) {
                if (!wrongEmailOrPassword) {
                    if (password.length > 0) {
                        setShowCreateButton(true);
                    }else{
                        setShowCreateButton(false);
                    }
                } else {
                    setShowCreateButton(false);
                }
            } else {
                setShowCreateButton(false);
                setEmailWrongFormat(true);
            }
        }else{
            setShowCreateButton(false);
        }
    }, [email, password, wrongEmailOrPassword]);

    const signIn = async () => {
        const data = {
            email: email,
            password: password
        }
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }
        fetch(env()["api-path"] + "login", requestOptions)
        .then(response => response.json())
        .then(data => {
            if(data["falseEmailPassword"] === 0){
                console.log("Email or password is wrong");
                toast({
                    title: 'Anmeldung fehlgeschlagen',
                    description: "Email und/oder Passwort ist falsch",
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                })
                setWrongEmailOrPassword(true);
              }else{
                console.log("Signed in successfully");
                toast({
                    title: 'Anmeldung erfolgreich',
                    description: "Sie werden nun im Konto angemeldet",
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                })
                sessionStorage.setItem('accountID', encryptString(data["id"].toString()));
                window.location.href = "/chooseuser";
            }
        })
        .catch(error => {
            console.error('There was an error!', error);
            toast({
                title: 'Anmeldung fehlgeschlagen',
                description: "Es gab Verarbeitungsprobleme, bitte erneut versuchen",
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        }
        );

    }

    return (
        <>
            <Heading size='md'>Hier anmelden</Heading>
            <FormControl isInvalid={isEmailError} isRequired>
                <FormLabel>Email</FormLabel>
                <Input 
                    type='email' 
                    onChange={e => setEmail(e.target.value)} 
                    placeholder='beispiel@epaul-smarthome.de' 
                    focusBorderColor='teal.500'
                    ref={props.initialRef} 
                />
                {!isEmailError ? (
                    <FormHelperText>
                        Email des E-Paul Kontos
                    </FormHelperText>
                ) : (
                    <FormErrorMessage>
                        {emailWrongFormat ? "Die Email hat das falsche Format" : "Email oder Passwort ist falsch"}
                    </FormErrorMessage>
                )}
            </FormControl>
            <br/>
            <FormControl isInvalid={isPasswordError} isRequired isDisabled={emailWrongFormat || !email}>
                <FormLabel>Passwort</FormLabel>
                <InputGroup size='md'>
                    <Input 
                        type={showPassword ? "text" : "password"} 
                        onChange={e => setPassword(e.target.value)}
                        focusBorderColor='teal.500'
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handlePasswordShowClick} isDisabled={emailWrongFormat || !email}>
                            {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        </Button>
                    </InputRightElement>
                </InputGroup>
                {!isPasswordError ? (
                    <FormHelperText>
                        Passwort für das E-Paul Konto
                    </FormHelperText>
                ) : (
                    <FormErrorMessage>
                        Email oder Passwort ist falsch
                    </FormErrorMessage>
                )}
            </FormControl>

            <br/>
            <Button colorScheme='teal' variant='solid' fontSize={[12, 12, 16]} padding={[1, 4]} isDisabled={!showCreateButton || emailWrongFormat || !password || !email} onClick={signIn}>
                Anmelden
            </Button>

        </>
        )
}
export default SignInForm;