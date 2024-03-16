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
InputGroup
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import MultiSelect from '@/components/multiselect'
import React, { useState, useEffect } from 'react'
import { decryptString } from '@/utils/encryptionUtils'
import {env} from '@/utils/env'


function AddGroupDialog(props) {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [accountClients, setAccountClients] = useState([]) 
    const [userClientIDs, setUserClientIDs] = useState([])
    const [userAssignmentGroupID, setUserAssignmentGroupID] = useState(null)
    const [assignedUserClients, setAssignedUserClients] = useState([])
    const [updateAssignedUserClients, setUpdateAssignedUserClients] = useState(false)

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
              setUserAssignmentGroupID(data[0].id);
              setUserClientIDs(data[1]);
              //setUpdateAssignedUserClients(!updateAssignedUserClients);
              
          })
          .catch((error) => {
              console.error('Error(fetchUserClientIDs):', error);
              setUserAssignmentGroupID(null);
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
    }, [userClientIDs, accountClients]);

    
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
                <br/> <br/>
                <MultiSelect items={[{'name': 'item1', 'value': '1'}, {'name': 'item2', 'value': '2'}]} onSelect={(items)=>{console.log(items)}} colorScheme={'teal'}></MultiSelect>
            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme='teal'>
                Hinzufügen
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }
  
  export default AddGroupDialog;