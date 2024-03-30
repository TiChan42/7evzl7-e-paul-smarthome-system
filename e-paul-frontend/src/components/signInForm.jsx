
/**
 * Komponente für das Anmeldeformular.
 * 
 * @component
 * @param {Object} props - Die Eigenschaften der Komponente.
 * @param {Function} props.executeSuccessfulSignIn - Eine Funktion, die aufgerufen wird, wenn die Anmeldung erfolgreich ist.
 * @returns {JSX.Element} Das Anmeldeformular.
 * @requires chakra-ui/react, react, ../utils/encryptionUtils, @chakra-ui/icons, ../utils/env
 */
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
    Heading,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { encryptString } from '../utils/encryptionUtils';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { env } from '../utils/env';

//Form for signing in
const SignInForm = (props) => {
    const toast = useToast();

    //Indikator ob das Passwort angezeigt werden soll
    const [showPassword, setShowPassword] = React.useState(false);
    const handlePasswordShowClick = () => setShowPassword(!showPassword);

    //Eingabefelder
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //Indikator ob der Erstellen-Button angezeigt werden soll
    const [showCreateButton, setShowCreateButton] = useState(false);

    //Überprüft ob die E-Mail-Adresse und das Passwort gültig sind
    const checkEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    //E-Mail-Überprüfungs Flags
    const [emailWrongFormat, setEmailWrongFormat] = useState(false);
    const [wrongEmailOrPassword, setWrongEmailOrPassword] = useState(false);
    useEffect(() => {
        setWrongEmailOrPassword(false);
    }, [email, password]);

    //Überprüfungs-Flags werden zusammengefasst
    const isEmailError = emailWrongFormat || wrongEmailOrPassword;
    const isPasswordError = wrongEmailOrPassword;

    //Überprüft ob die Eingaben korrekt sind und setzt die Flags
    useEffect(() => {
        setEmailWrongFormat(false);
        setWrongEmailOrPassword(false);

        if (email.length > 0) {
            if (checkEmail(email)) {
                if (!wrongEmailOrPassword) {
                    if (password.length > 0) {
                        setShowCreateButton(true);
                    } else {
                        setShowCreateButton(false);
                    }
                } else {
                    setShowCreateButton(false);
                }
            } else {
                setShowCreateButton(false);
                setEmailWrongFormat(true);
            }
        } else {
            setShowCreateButton(false);
        }
    }, [email, password, wrongEmailOrPassword]);

    const signIn = async () => {
        const data = {
            email: email,
            password: password,
        };
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        };
        fetch(env()['api-path'] + 'login', requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data['falseEmailPassword'] === 0) {
                    toast({
                        title: 'Anmeldung fehlgeschlagen',
                        description: 'Email und/oder Passwort ist falsch',
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    });
                    setWrongEmailOrPassword(true);
                } else {
                    toast({
                        title: 'Anmeldung erfolgreich',
                        description: 'Sie werden nun im Konto angemeldet',
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                    });

                    sessionStorage.setItem(
                        'accountID',
                        encryptString(data['id'].toString())
                    );
                    props.executeSuccessfulSignIn();
                }
            })
            .catch((error) => {
                console.error('There was an error!', error);
                toast({
                    title: 'Anmeldung fehlgeschlagen',
                    description:
                        'Es gab Verarbeitungsprobleme, bitte erneut versuchen',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            });
    };
    const references = [React.useRef(), React.useRef(), React.useRef()];
    //Keylistener für das Drücken der Enter-Taste und Tab-Taste
    const handleKeyDown = React.useCallback(
        (e) => {
            if (e.key === 'Enter' || e.key === 'Tab') {
                e.preventDefault();
                if (references[0].current === document.activeElement) {
                    if (!references[1].current.disabled)
                        references[1].current.focus();
                } else if (references[1].current === document.activeElement) {
                    if (!references[2].current.disabled)
                        references[2].current.focus();
                } else if (references[2].current === document.activeElement) {
                    signIn();
                }
            }
            // eslint-disable-next-line
        },
        [references]
    );

    useEffect(() => {
        // Add event listener when the component mounts
        window.addEventListener('keydown', handleKeyDown);

        // Remove event listener when the component unmounts
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    useEffect(() => {
        references[0].current.focus();
        // eslint-disable-next-line
    }, []);

    return (
        <form>
            <Heading size='md'>Hier anmelden</Heading>
            <FormControl
                isInvalid={isEmailError}
                isRequired
            >
                <FormLabel>Email</FormLabel>
                <Input
                    ref={references[0]}
                    borderColor={'teal.200'}
                    _hover={{ borderColor: 'teal.300' }}
                    focusBorderColor='teal.500'
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='beispiel@epaul-smarthome.de'
                    type='email'
                    autoComplete='off'
                />
                {!isEmailError ? (
                    <FormHelperText>Email des E-Paul Kontos</FormHelperText>
                ) : (
                    <FormErrorMessage>
                        {emailWrongFormat
                            ? 'Die Email hat das falsche Format'
                            : 'Email oder Passwort ist falsch'}
                    </FormErrorMessage>
                )}
            </FormControl>
            <br />
            <FormControl
                isDisabled={emailWrongFormat || !email}
                isInvalid={isPasswordError}
                isRequired
            >
                <FormLabel>Passwort</FormLabel>
                <InputGroup size='md'>
                    <Input
                        ref={references[1]}
                        borderColor={'teal.200'}
                        _hover={{ borderColor: 'teal.300' }}
                        focusBorderColor='teal.500'
                        onChange={(e) => setPassword(e.target.value)}
                        type={showPassword ? 'text' : 'password'}
                        autoComplete='off'
                    />
                    <InputRightElement w='4.5rem'>
                        <Button
                            h='1.75rem'
                            isDisabled={emailWrongFormat || !email}
                            onClick={handlePasswordShowClick}
                            size='sm'
                        >
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

            <br />
            <Button
                ref={references[2]}
                p={[1, 4]}
                fontSize={[12, 12, 16]}
                colorScheme='teal'
                isDisabled={
                    !showCreateButton || emailWrongFormat || !password || !email
                }
                onClick={signIn}
                variant='solid'
            >
                Anmelden
            </Button>
        </form>
    );
};
export default SignInForm;
