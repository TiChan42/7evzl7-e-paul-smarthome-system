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
  import { generateRandomUsername } from '../randomUsernameGenerator';
  import { ViewIcon, ViewOffIcon,  RepeatIcon } from '@chakra-ui/icons'
  import {env} from '../env';


//Komponente für die Abfrage des Pins und (wenn nötig) des Benutzers
const AddUserModal = (props) => {
    const [showPin, setShowPin] = React.useState(false)
    const handlePinShowClick = () => setShowPin(!showPin)

    const [generatedName, setGeneratedName] = useState(generateRandomUsername());
    const handleRefreshName = () => setGeneratedName(generateRandomUsername());

    const [inputValue, setInputValue] = useState(generatedName);
    useEffect(() => {
        setInputValue(generatedName);
    }, [generatedName]);
    return (
        <>
        <Modal
        isOpen={props.openModal}
        onClose={props.closeModal}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Benutzer hinzufügen</ModalHeader>
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
                                value={inputValue}
                                onChange={e => setInputValue(e.target.value)}
                            />
                            <InputRightElement width='4.5rem'>
                                <Button h='1.75rem' size='sm' onClick={handleRefreshName}>
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
                                
                            />
                            <InputRightElement width='4.5rem'>
                                <Button h='1.75rem' size='sm' onClick={handlePinShowClick}>
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
                                placeholder='Hier Pin eingeben...'
                                maxLength='32'
                                
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
                    <Button colorScheme="blue" mr={3} onClick={props.closeModal}>
                        Schließen
                    </Button>
                    <Button variant="ghost">Hinzufügen</Button>
                </ModalFooter>
                
            </ModalContent>
        </Modal>
        </>
    )
  }
  
  export default AddUserModal;