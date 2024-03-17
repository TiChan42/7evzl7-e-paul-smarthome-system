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
Input,
FormControl,
FormLabel,
FormErrorMessage,
InputGroup,
useToast
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import MultiSelect from '@/components/multiselect'
import React, { useState, useEffect } from 'react'
import { decryptString } from '@/utils/encryptionUtils'
import {env} from '@/utils/env'


function AddGroupDialog() {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [accountClients, setAccountClients] = useState([]) 
    const [userClientIDs, setUserClientIDs] = useState([])
    const [assignedUserClients, setAssignedUserClients] = useState([])
    const [preparedAssignedUserClients, setPreparedAssignedUserClients] = useState([])
    const [selectedClientIDs, setSelectedClientIDs] = useState([])
    const fetchAccountClients = () => {
      let  accountID = decryptString(sessionStorage.getItem('accountID'));
      if (accountID) {
        fetch(env()["api-path"] + 'getPorts/'+ accountID , {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            setAccountClients(data);
            //setUpdateAssignedUserClients(!updateAssignedUserClients);
        })
        .catch((error) => {
            console.error('Error(fetchAccountClients):', error);
            setAccountClients([]);
            //setUpdateAssignedUserClients(!updateAssignedUserClients);
        });
      }
    }

    const fetchUserClientIDs = () => {
        let userID = decryptString(sessionStorage.getItem('executingUserID'));
        if (userID) {
          fetch(env()["api-path"] + 'getGroup/Assignment/' + userID, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
              }
          })
          .then(response => response.json())
          .then(data => {
              setUserClientIDs(data[1]);
              //setUpdateAssignedUserClients(!updateAssignedUserClients);
              
          })
          .catch((error) => {
              console.error('Error(fetchUserClientIDs):', error);
              setUserClientIDs([]);
              //setUpdateAssignedUserClients(!updateAssignedUserClients);
          });
        }
    }
    useEffect(() => {
      let temp = [];
        if(accountClients && userClientIDs && accountClients[0] && userClientIDs[0]){
            accountClients.forEach((client) => {
                if (userClientIDs.includes(client.id)) {
                    temp.push(client);
                }
            })
        }
        setAssignedUserClients(temp);
        console.log(assignedUserClients);
    }, [userClientIDs, accountClients]);


    const generateNameOutOfID = (id) => {
        let temp = (id*2345+id*856+id*71)/(id*id*id)
        //More complex function to generate a name out of the id
        temp = parseInt((temp*2345+temp*856+temp*71)/(id*id)) ;
        return 'Client_'+temp.toString();
    }
    useEffect(() => {
        let temp = [];
        if(assignedUserClients && assignedUserClients[0]){
            assignedUserClients.forEach((client) => {
                temp.push({'name': client.name?client.name:generateNameOutOfID(client.id), 'value': client.id});
            })
        }
        setPreparedAssignedUserClients(temp);
    }, [assignedUserClients]);

    
    const [groupNameInUse, setGroupNameInUse] = useState(false);
    const [groupNameValid, setGroupNameValid] = useState(false);
    //Test if the given Group-Name is already in use for the executingUserID
    const isGroupNameInUse = (groupName) => {
        let userID = decryptString(sessionStorage.getItem('executingUserID'));
        if (userID) {
          fetch(env()["api-path"] + 'getGroup/Standard/' + userID, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
              }
          })
          .then(response => response.json())
          .then(data => {
              let groupNames = data.map((group) => group[0]['name']);
              setGroupNameInUse(groupNames.includes(groupName))
              setGroupNameValid(groupName.length > 0 && groupName.length <= 32 && !groupNameInUse)
          })
          .catch((error) => {
              console.error('Error(isGroupNameInUse):', error);
          });
        }
    }

    const handleGroupNameChange = (event) => {
        let groupName = event.target.value
        isGroupNameInUse(groupName)
        setGroupNameValid(groupName.length > 0 && groupName.length <= 32 && !groupNameInUse)
    }

    useEffect(() => {
      fetchAccountClients();
      fetchUserClientIDs();
    }, [isOpen]);

    return (
      <>
        <Button onClick={onOpen}>
            <AddIcon mr={2}></AddIcon>
            Hinzufügen
        </Button>
  
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Gruppe Hinzufügen</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl isInvalid={!groupNameValid} isRequired>
                        <FormLabel>Name der Gruppe</FormLabel>
                        <InputGroup size='md'>
                            <Input
                                pr='4.5rem'
                                type= 'text'
                                placeholder='Bsp.: Wohnzimmer, Lichter, ...'
                                maxLength={32}
                                onChange={(event)=> {handleGroupNameChange(event)}}
                                focusBorderColor='teal.500'
                            />
                        </InputGroup>
                        {(!groupNameValid) &&
                            <FormErrorMessage>
                                {groupNameInUse ? "Gruppenname bereits vergeben" : "Gruppenname muss zwischen 1 und 32 Zeichen lang sein"}
                            </FormErrorMessage>
                        }
                    </FormControl>
                    <br/>
                    <br/>
                    <FormControl>
                        <FormLabel>Auswahl der Clients für die Gruppe</FormLabel>
                        <MultiSelect items={preparedAssignedUserClients} onSelect={(items)=>{setSelectedClientIDs(items.map((item) => item.value))}} colorScheme={'teal'} placeHolder={'Klicken zum auswählen'}></MultiSelect>
                    </FormControl>
                </ModalBody>
  
                <ModalFooter>
                    <Button colorScheme='teal' isDisabled={!groupNameValid}>
                      Hinzufügen
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
      </>
    )
  }
  
  export default AddGroupDialog;