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
    Select,
    Input,
    InputGroup,
    InputRightElement,
  } from '@chakra-ui/react'
  import React, { useState, useEffect } from 'react';
  import { encryptString, decryptString } from '../encryptionUtils';
  import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
  import {env} from '../env';

//Komponente für die Abfrage des Pins und (wenn nötig) des Benutzers
const UserPinRequestModal = (props) => {
    const [showPin, setShowPin] = React.useState(false)
    const [requireUserSelection, setRequireUserSelection] = useState(false)
    const [noPossibleUser, setNoPossibleUser] = useState(false)
    const [userSelectValue, setUserSelectValue] = useState(null)
    const [executingUser, setExecutingUser] = useState(null)
    const handlePinShowClick = () => setShowPin(!showPin)

    //Versuch den Pin zu validieren
    const tryToSubmitPin = (event) => {
        const pin = event.target.value;
        const userID = (requireUserSelection) ? userSelectValue : decryptString(sessionStorage.getItem('executingUserID'));
        const data = {
            pin: pin,
            userID: userID
        }
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }
        fetch(env["api-path"] + "validatePin", requestOptions)
        .then(response => response.json())
        .then(data => {
            if(data.valid){
                event.target.value = "";
                sessionStorage.setItem('executingUserID', encryptString(userID.toString()));
                sessionStorage.setItem('userAuthorized', encryptString("true"));
                props.closeModal();
                props.executeIfValid();
            }
        })
        .catch(error => {
            console.log(error);
            event.target.value = "";
        })
    }

    //Holt den Benutzer anhand der ID
    function getUserByID(id){
        return props.users.find(user => user.id === id);
    }

    //Auswahl der Angezeigten Fensters zwischen Benutzerauswahl + Pin-Eingabe, oder nur Pin-Eingabe, oder keine Benutzer vorhanden
    useEffect (() => {
        console.log(decryptString(sessionStorage.getItem('executingUserID')));
        if(sessionStorage.getItem('executingUserID') === ""){
            sessionStorage.setItem('userAuthorized', encryptString("false"));
            setRequireUserSelection(true);
            if(props.users[0] == null){
                setNoPossibleUser(true);
            }
        }
        else 
        {

            setExecutingUser(getUserByID(decryptString(sessionStorage.getItem('executingUserID'))));
            setRequireUserSelection(false);
        }
    }, [props.users,props.openModal]);

    
    
    return (
        <React.Fragment>
          
        <Modal
        isOpen={props.openModal}
        onClose={props.closeModal}
        >
            <ModalOverlay />
                <ModalContent>
                    {noPossibleUser && 
                        <React.Fragment>
                            <ModalHeader color='Red'>Keine Benutzer vorhanden</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                Es sind keine Benutzer vorhanden. Bitte erstellen Sie einen Benutzer.
                            </ModalBody>
                            <ModalFooter>
                                <Button onClick={props.closeModal}>Schließen</Button>
                            </ModalFooter>
                        </React.Fragment>
                    }
                    {!noPossibleUser &&
                        <React.Fragment>
                            {requireUserSelection && props.users &&
                            <ModalHeader>Benutzerauswahl und Pin</ModalHeader>
                            }
                            {!requireUserSelection && props.users &&
                            <ModalHeader>Pin eingeben</ModalHeader>
                            }
                            <ModalCloseButton />
                            <ModalBody pb={6}>
                                {requireUserSelection && props.users &&
                                    <FormControl>
                                        <FormLabel>ausführenden Benutzer auswählen</FormLabel>
                                        <Select defaultValue={props.users[0].id} placeholder={props.users[0].name} onClick={(event) => setUserSelectValue(event.target.value)} isRequired>
                                            {props.users.slice(1).map((user) => (
                                                <option key={user.id} value={user.id}>
                                                    {user.name}
                                                </option>
                                            ))}
                                        </Select>
                                    </FormControl>
                                }
                                <FormControl>
                                    <FormLabel>Pin zur Autorisierung</FormLabel>
                                    <InputGroup size='md'>
                                        <Input
                                            pr='4.5rem'
                                            type={showPin ? 'text' : 'password'}
                                            placeholder='Hier Pin eingeben...'
                                            maxLength='32'
                                            onChange={tryToSubmitPin}
                                        />
                                        <InputRightElement width='4.5rem'>
                                            <Button h='1.75rem' size='sm' onClick={handlePinShowClick}>
                                            {showPin ? <ViewIcon/> : <ViewOffIcon/>}
                                            </Button>
                                        </InputRightElement>
                                    </InputGroup>
                                </FormControl>
                            </ModalBody>

                            <ModalFooter>
                                <Button onClick={props.closeModal}>Schließen</Button>
                            </ModalFooter>

                        </React.Fragment>
                    }
                </ModalContent>
            
        </Modal>
        </React.Fragment>
    )
  }
  
  export default UserPinRequestModal;