import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
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


function UserPinRequestModal(executeIfValid, users) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [showPin, setShowPin] = React.useState(false)
    const [requireUserSelection, setRequireUserSelection] = useState(false)
    const [noPossibleUser, setNoPossibleUser] = useState(false)
    const [userSelectValue, setUserSelectValue] = useState(null)
    const handlePinShowClick = () => setShowPin(!showPin)
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
                onClose();
                executeIfValid();
            }
        })
        .catch(error => {
            console.log(error);
            event.target.value = "";
        })

    }

    useEffect (() => {
        if(sessionStorage.getItem('executingUserID') === ""){
            sessionStorage.setItem('userAuthorized', encryptString("false"));
            setRequireUserSelection(true);
            if(users === null){
                setNoPossibleUser(true);
            }
        }
    }, [isOpen]);

    
    
    return (
        <React.Fragment>
        <Button onClick={onOpen}>Open Modal</Button>    
        <Modal
        isOpen={isOpen}
        onClose={onClose}
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
                                <Button onClick={onClose}>Schließen</Button>
                            </ModalFooter>
                        </React.Fragment>
                    }
                    {!noPossibleUser &&
                        <React.Fragment>
                            <ModalHeader>Pin Eingabe</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody pb={6}>
                                {requireUserSelection && users &&
                                    <FormControl>
                                        <FormLabel>ausführenden Benutzer auswählen</FormLabel>
                                        <Select defaultValue={users[0].id} placeholder={users[0].name} onChange={(event) => setUserSelectValue(event.target.value)}>
                                            {users.map((user) => (
                                                <option key={user.id} value={user.id}>{user.name}</option>
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
                                
                                
                                <Button onClick={onClose}>Schließen</Button>
                            </ModalFooter>
                        </React.Fragment>
                    }
                </ModalContent>
        </Modal>
        </React.Fragment>
    )
  }
  
  export default UserPinRequestModal;