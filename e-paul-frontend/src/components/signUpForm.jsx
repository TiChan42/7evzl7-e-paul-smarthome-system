
/**
 * Komponente für das Registrierungsformular.
 * 
 * @component
 * @param {Object} props - Die Eigenschaften der Komponente.
 * @param {Function} props.executeSuccessfulSignUp - Eine Funktion, die aufgerufen wird, wenn die Registrierung erfolgreich war.
 * @returns {JSX.Element} Das Registrierungsformular.
 * @requires chakra-ui/react, react, @chakra-ui/icons, ../utils/env
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
    Heading,
    useToast,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { env } from '../utils/env';

//Form signing up
const SignUpForm = (props) => {
    const toast = useToast();

    //Indikator ob das Passwort angezeigt werden soll
    const [showPassword, setShowPassword] = React.useState(false);
    const handlePasswordShowClick = () => setShowPassword(!showPassword);

    //Eingabefelder
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');

    //Indikator ob der Erstellen-Button angezeigt werden soll
    const [showCreateButton, setShowCreateButton] = useState(false);

    //Überprüft ob die E-Mail-Adresse und das Passwort gültig sind
    const checkEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };
    const checkPasswordChars = (password) => {
        const re =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^&_*+\-=~`|\\/:;,.<>,])([A-Za-z\d@$!%*?&#^&_*+\-=~`|\\/:;,.<>,]){8,}$/;
        return re.test(password);
    };
    const checkPasswordLength = (password) => {
        return password.length >= 8;
    };
    const checkPasswordsEqual = (password, passwordRepeat) => {
        return password === passwordRepeat;
    };

    //E-Mail-Überprüfungs Flags
    const [emailWrongFormat, setEmailWrongFormat] = useState(false);
    const [emailAlreadyExists, setEmailAlreadyExists] = useState(false);
    useEffect(() => {
        setEmailAlreadyExists(false);
    }, [email]);

    //Passwort-Überprüfungs Flags
    const [passwordTooShort, setPasswordTooShort] = useState(false);
    const [passwordWrongFormat, setPasswordWrongFormat] = useState(false);

    //Passwort-Wiederholungs-Überprüfungs Flags
    const [passwordsNotEqual, setPasswordsNotEqual] = useState(false);

    //Überprüfungs-Flags werden zusammengefasst
    const isEmailError = emailWrongFormat || emailAlreadyExists;
    const isPasswordError = passwordTooShort || passwordWrongFormat;
    const isPasswordRepeatError = passwordsNotEqual;

    //Überprüft ob die Eingaben korrekt sind und setzt die Flags
    useEffect(() => {
        setEmailWrongFormat(false);
        setPasswordTooShort(false);
        setPasswordWrongFormat(false);
        setPasswordsNotEqual(false);

        if (email.length > 0) {
            if (checkEmail(email)) {
                if (!emailAlreadyExists) {
                    setEmailAlreadyExists(false);
                    if (password.length > 0) {
                        if (checkPasswordLength(password)) {
                            if (checkPasswordChars(password)) {
                                if (
                                    checkPasswordsEqual(
                                        password,
                                        passwordRepeat
                                    )
                                ) {
                                    setShowCreateButton(true);
                                } else {
                                    setShowCreateButton(false);
                                    setPasswordsNotEqual(true);
                                }
                            } else {
                                setShowCreateButton(false);
                                setPasswordWrongFormat(true);
                            }
                        } else {
                            setShowCreateButton(false);
                            setPasswordTooShort(true);
                        }
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
    }, [email, password, passwordRepeat, emailAlreadyExists]);

    const signUp = async () => {
        const data = {
            email: email,
            password: password,
        };
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        };
        fetch(env()['api-path'] + 'signUp', requestOptions)
            .then((response) => {
                // Status 201 = Created
                if (response.status === 201) {
console.log('Registed successfully');
                    toast({
                        title: 'Konto erfolgreich erstellt',
                        description: 'Sie Können sich nun anmelden',
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                    });
                    props.executeSuccessfulSignUp();
                } else if (response.status === 420) {
                    console.log('Account already exists');
                    toast({
                        title: 'Das Konto existiert bereits',
                        description:
                            'Bitte melden Sie sich an oder verwenden Sie eine andere Email-Adresse',
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    });
                    setEmailAlreadyExists(true);
                } else {
                    console.log('Registration failed');
                    toast({
                        title: 'Registrierung fehlgeschlagen',
                        description:
                            'Es gab Verarbeitungsprobleme, bitte erneut versuchen',
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    });
                }
            })
            .catch((error) => {
                console.error('There was an error!', error);
                toast({
                    title: 'Registrierung fehlgeschlagen',
                    description:
                        'Es gab Verarbeitungsprobleme, bitte erneut versuchen',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            });
    };
    const references = [
        React.useRef(),
        React.useRef(),
        React.useRef(),
        React.useRef(),
    ];

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
                    if (!references[3].current.disabled)
                        references[3].current.focus();
                } else if (references[3].current === document.activeElement) {
                    signUp();
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
            <Heading size='md'>Hier registrieren</Heading>
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
                    <FormHelperText>
                        Email, mit der das E-Paul Konto verbunden werden soll
                    </FormHelperText>
                ) : (
                    <FormErrorMessage>
                        {emailWrongFormat
                            ? 'Die Email hat das falsche Format'
                            : 'Ein Konto mit dieser Email existiert bereits'}
                    </FormErrorMessage>
                )}
            </FormControl>
            <br />
            <FormControl
                isDisabled={isEmailError || !email}
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
                            isDisabled={isEmailError || !email}
                            onClick={handlePasswordShowClick}
                            size='sm'
                        >
                            {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        </Button>
                    </InputRightElement>
                </InputGroup>

                {!isPasswordError && !password && (
                    <>
                        <FormHelperText>
                            Das Passwort muss mindestens 8 Zeichen lang sein.
                        </FormHelperText>
                        <FormHelperText>
                            Das Passwort muss je mindestens einen kleinen
                            Buchstaben, einen großen Buchstaben, eine Zahl und
                            ein Sonderzeichen enthalten.
                        </FormHelperText>
                    </>
                )}

                {!isPasswordError && password ? (
                    <FormHelperText>
                        Passwort für das E-Paul Konto
                    </FormHelperText>
                ) : (
                    <FormErrorMessage>
                        {passwordTooShort
                            ? 'Das Passwort muss mindestens 8 Zeichen lang sein'
                            : passwordWrongFormat
                              ? 'Das Passwort muss je mindestens einen kleinen Buchstaben, einen großen Buchstaben, eine Zahl und ein Sonderzeichen enthalten'
                              : 'Die Passwörter stimmen nicht überein'}
                    </FormErrorMessage>
                )}
            </FormControl>

            <br />
            <FormControl
                isDisabled={
                    isPasswordError || !password || isEmailError || !email
                }
                isInvalid={isPasswordRepeatError}
                isRequired
            >
                <FormLabel>Passwort wiederholen</FormLabel>
                <InputGroup size='md'>
                    <Input
                        ref={references[2]}
                        borderColor={'teal.200'}
                        _hover={{ borderColor: 'teal.300' }}
                        focusBorderColor='teal.500'
                        onChange={(e) => setPasswordRepeat(e.target.value)}
                        type={showPassword ? 'text' : 'password'}
                        autoComplete='off'
                    />
                    <InputRightElement w='4.5rem'>
                        <Button
                            h='1.75rem'
                            isDisabled={
                                isPasswordError ||
                                !password ||
                                isEmailError ||
                                !email
                            }
                            onClick={handlePasswordShowClick}
                            size='sm'
                        >
                            {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        </Button>
                    </InputRightElement>
                </InputGroup>
                {!isPasswordRepeatError ? (
                    <FormHelperText>Passwort wiederholen</FormHelperText>
                ) : (
                    <FormErrorMessage>
                        Die Passwörter stimmen nicht überein
                    </FormErrorMessage>
                )}
            </FormControl>
            <br />
            <Button
                ref={references[3]}
                p={[1, 4]}
                fontSize={[12, 12, 16]}
                colorScheme='teal'
                isDisabled={
                    !showCreateButton ||
                    isPasswordError ||
                    !password ||
                    isEmailError ||
                    !email
                }
                onClick={signUp}
                variant='solid'
            >
                Registrieren
            </Button>
        </form>
    );
};
export default SignUpForm;
