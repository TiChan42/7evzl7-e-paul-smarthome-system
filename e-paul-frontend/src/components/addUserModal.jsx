import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Checkbox
  } from '@chakra-ui/react'
  import React, { useState, useEffect } from 'react';
  import { decryptString } from '../encryptionUtils';
  import { generateRandomUsername } from '../randomUsernameGenerator';
  import { ViewIcon, ViewOffIcon,  RepeatIcon } from '@chakra-ui/icons'
  import {env} from '../env';


//Komponente für das Hinzufügen eines Benutzers (Modal)
const AddUserModal = (props) => {
    //Indikator ob der Pin angezeigt werden soll
    const [showPin, setShowPin] = React.useState(false)
    const handlePinShowClick = () => setShowPin(!showPin)

    //Generierter Benutzername
    const [generatedName, setGeneratedName] = useState(generateRandomUsername());
    const handleRefreshName = () => setGeneratedName(generateRandomUsername());

    //Eingabefelder
    const [userName, setUserName] = useState(generatedName);
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");
    const [isAdmin, setIsAdmin] = useState(props.requireAdmin);

    //Updater für den Benutzernamen
    useEffect(() => {
        setUserName(generatedName);
    }, [generatedName]);

    //Indikator ob der Erstellen-Button angezeigt werden soll
    const [showCreateButton, setShowCreateButton] = useState(!props.requireAdmin);

    //Überprüft ob die Eingaben korrekt sind
    useEffect(() => {
        if (userName.length > 0) {
            if (password === passwordRepeat) {
                if (password.length >= 6) {
                    setShowCreateButton(true);
                }else if(!isAdmin){
                    setShowCreateButton(true);
                }else{
                    setShowCreateButton(false);
                }
            } else {
                setShowCreateButton(false);
            }
        }else{
            setShowCreateButton(false);
        }
    }, [password, passwordRepeat, isAdmin, userName]);

    //Erstellt den Benutzer basierend auf den Eingaben
    function createUser(){
        const data = {
            username: userName,
            pin: password,
            isAdmin: isAdmin,
            accountId: decryptString(sessionStorage.getItem('accountID')),
            userImageName: "user_profile_0.jpg"
        }
        console.log(data);
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }
        console.log(requestOptions);
        fetch(env()["api-path"] + "signUp/user", requestOptions)
        .then(() => {
            props.closeModal();
        })
    }

    return (
        <>
        <Modal
        isOpen={props.openModal}
        onClose={props.closeModal}
        closeOnOverlayClick={!props.disableClose}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Benutzer erstellen</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl>
                        <FormLabel>Benutzername</FormLabel>
                        <InputGroup size='md'>
                            <Input
                                pr='4.5rem'
                                type= 'text'
                                placeholder='Benutzernamen aussuchen...'
                                maxLength={12}
                                value={userName}
                                onChange={e => setUserName(e.target.value)}
                                focusBorderColor='teal.500'
                            />
                            <InputRightElement width='4.5rem'>
                                <Button h='1.75rem' size='sm' onClick={handleRefreshName} >
                                    <RepeatIcon/>
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>
                    <br></br>
                    <FormControl>
                        <FormLabel>Pin</FormLabel>
                        <InputGroup size='md'>
                            <Input
                                pr='4.5rem'
                                type={showPin ? 'text' : 'password'}
                                placeholder='Hier Pin eingeben...'
                                maxLength='32'
                                focusBorderColor='teal.500'
                                onChange={e => setPassword(e.target.value)}
                            />
                            <InputRightElement width='4.5rem'>
                                <Button h='1.75rem' size='sm' onClick={handlePinShowClick} >
                                    {showPin ? <ViewIcon/> : <ViewOffIcon/>}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>
                    <br></br>
                    <FormControl>
                        <FormLabel>Pin widerholen</FormLabel>
                        <InputGroup size='md'>
                            <Input
                                pr='4.5rem'
                                type={showPin ? 'text' : 'password'}
                                placeholder='Pin widerholen...'
                                maxLength='32'
                                focusBorderColor='teal.500'
                                onChange={e => setPasswordRepeat(e.target.value)}
                            />
                            <InputRightElement width='4.5rem'>
                                <Button h='1.75rem' size='sm' onClick={handlePinShowClick} >
                                    {showPin ? <ViewIcon/> : <ViewOffIcon/>}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>
                    <br></br>
                    <FormControl display='flex' alignItems='center'>
                        {props.requireAdmin &&
                            <Checkbox isDisabled defaultChecked size='lg' colorScheme='teal' onChange={e=> setIsAdmin(e.target.value)}>
                                Soll der Benutzer ein Admin sein?
                            </Checkbox>
                        }
                        {!props.requireAdmin &&
                            <Checkbox size='lg' colorScheme='teal' onChange={e=> setIsAdmin(e.target.value)}>
                                Soll der Benutzer ein Admin sein?
                            </Checkbox>
                        }
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    {!props.disableClose &&
                        <Button mr={3} onClick={props.closeModal}>Schließen</Button>
                    }
                    {showCreateButton &&
                        <Button colorScheme='teal' onClick = {() => createUser()}>Erstellen</Button>
                    }
                    
                </ModalFooter>
                
            </ModalContent>
        </Modal>
        </>
    )
  }
  
  export default AddUserModal;