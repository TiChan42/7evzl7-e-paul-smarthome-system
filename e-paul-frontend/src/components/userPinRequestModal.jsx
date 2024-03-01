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
    const [userSelectValue, setUserSelectValue] = useState(props.users[0].id)
    const handlePinShowClick = () => setShowPin(!showPin)

    //Versuch den Pin zu validieren
    const tryToSubmitPin = (event) => {
        const pin = event.target.value;
        const userID = (requireUserSelection) ? userSelectValue : decryptString(sessionStorage.getItem('executingUserID'));
        const data = {
            pin: pin,
            userId: userID,
            accountId: decryptString(sessionStorage.getItem('accountID'))
        }
        console.log(data);
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }
        console.log(requestOptions);
        console.log(env()["api-path"] + "validatePin");
        fetch(env()["api-path"] + "validatePin", requestOptions)
        .then(response => {
            console.log(response); // HTTP-Response ausgeben
            return response.json();
        })
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

    //Auswahl der Angezeigten Fensters zwischen Benutzerauswahl + Pin-Eingabe, oder nur Pin-Eingabe, oder keine Benutzer vorhanden
    useEffect (() => {
        if(sessionStorage.getItem('executingUserID') === ""){
            sessionStorage.setItem('userAuthorized', encryptString("false"));
            setRequireUserSelection(true);
            if(props.users[0] == null){
                setNoPossibleUser(true)
            }
        }
        else 
        {
            setRequireUserSelection(false);
        }
    }, [props.users,props.openModal]);

    
    
    return (
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
                                    <Select onChange={(event) => {setUserSelectValue(event.target.value)}} >
                                        {props.users.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.username}
                                            </option>
                                        ))}
                                    </Select>
                                    <br></br>
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
    )
  }
  
  export default UserPinRequestModal;