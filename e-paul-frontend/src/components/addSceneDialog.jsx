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
    FormHelperText,
    FormErrorMessage,
    InputGroup,
    useToast,
    Flex,
    Center,
    Text,
    Box,
    Heading,
    IconButton,
    Spacer
} from '@chakra-ui/react'
import { AddIcon,EditIcon } from '@chakra-ui/icons'
import React, { useState, useEffect } from 'react'
import { decryptString } from '@/utils/encryptionUtils'
import {env} from '@/utils/env'
import ControllerCommandsModal from '@/components/controllerCommandsModal'



function AddSceneDialog(props) {
    const toast = useToast()

    const { isOpen, onOpen, onClose } = useDisclosure()

    const [sceneNameInUse, setSceneNameInUse] = useState(false);
    const [sceneNameValid, setSceneNameValid] = useState(false);
    const [sceneNameValue, setSceneNameValue] = useState('');
    const [groupClients, setGroupClients] = useState([])

    const [ignoredPorts, setIgnoredPorts] = useState([])

    const [scenePortModals, setScenePortModals] = useState([])
    const [rerender, setRerender] = useState(false)

    //prüft ob der Szenenname bereits vergeben ist
    const checkSceneNameInUse = (sceneName) => {
        let userID = decryptString(sessionStorage.getItem('executingUserID'));
        if (userID) {
            fetch(env()["api-path"] + 'getScenes/'+ props.groupId, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(response => {
                if(response.status === 200)
                {
                    return response.json();
                }else{
                    console.error('Error(fetchScenes):', response);
                }
            })
            .then(data => {
                let sceneNames = data.map(scene => scene.name);
                if (sceneNames.includes(sceneName)) {
                    setSceneNameInUse(true);
                }
                else {
                    setSceneNameInUse(false);
                }
            })
            .catch((error) => {
                console.error('Error(fetchScenes):', error);
                setSceneNameInUse(true);
            });
        }
    }
    
    //prüft ob der Szenenname gültig ist
    useEffect(() => {
        if (sceneNameValue.length > 0 && sceneNameValue.length <= 32 && !sceneNameInUse) {
            setSceneNameValid(true);
        }
        else {
            setSceneNameValid(false);
        }
    },[sceneNameValue, sceneNameInUse]);
    
    //setzt den Szenennamen
    const handleSceneNameChange = (event) => {
        let value = event.target.value;
        setSceneNameValue(value);
        checkSceneNameInUse(value);
    }

    //testet ob die Clients für die Szene gültig sind
    useEffect(() => {
        if (props.groupClients && props.groupClients.length > 0) {
            setGroupClients(props.groupClients);

            //für jedes Element in scenePort wird scenePortModals um ein false erweitert
            let temp = [];
            groupClients.forEach(() => {
                temp.push(false);
            });
            setScenePortModals(temp);
        }
    }, [props.groupClients, isOpen]);

    //Generiert einen Namen aus der ID
    const generateNameOutOfID = (id) => {
        let temp = (id*2345+id*856+id*71)/(id*id*id)
        //More complex function to generate a name out of the id
        temp = parseInt((temp*2345+temp*856+temp*71)/(id*id)) ;
        return 'Client_'+temp.toString();
    }

    //neue Szene hinzufügen (TODO)
    const addScene = (sceneName) => {
        let userID = decryptString(sessionStorage.getItem('executingUserID'));
        if (userID) {
            let data= {
                executingUserId: userID,
                groupId: props.groupId,
                name: sceneName,
                ignoredPorts: ignoredPorts
            }
            fetch(env()["api-path"] + 'group/scene/addScene', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if(response.status === 201)
                {
                    toast({
                        title: "Szene erfolgreich hinzugefügt",
                        status: "success",
                        duration: 1000,
                        isClosable: true,
                    })
                    props.reloadScenes();
                    setSceneNameValue('');
                    setIgnoredPorts([]);
                    onClose();
                }else{
                    toast({
                        title: "Fehler beim Hinzufügen der Szene",
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                    })
                }
            })
            .catch((error) => {
                console.error('Error(addScene):', error);
                toast({
                    title: "Fehler beim Hinzufügen der Szene",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                })
            });
        }
    }

    return (
        <>
        <Button 
            onClick={onOpen} 
            variant={'outline'} 
            mt={3}
            borderColor={'teal.500'}
            color={'teal.500'}
            _hover={{bg: 'teal.200'}}
            _active={{bg: 'teal.300', color: 'teal.600'}}

        >
            <AddIcon mr={2}></AddIcon>
            Szene Hinzufügen
        </Button>
    
        <Modal isOpen={isOpen} onClose={onClose} size={{base:'full' , sm:'md'}}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader w={'90%'}>Szene für die Gruppe "{props.groupName}" Hinzufügen</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl isInvalid={!sceneNameValid} isRequired>
                        <FormLabel>Name der Szene</FormLabel>
                        <InputGroup size='md'>
                            <Input
                                value={sceneNameValue}
                                pr='4.5rem'
                                type= 'text'
                                placeholder='Bsp.: Kino, Arbeit, Anschalten, ...' 
                                maxLength={32}
                                onChange={(event)=> {handleSceneNameChange(event)}}
                                focusBorderColor='teal.500'
                                _hover={{borderColor: 'teal.400'}}
                                borderColor='teal.100'
                            />
                        </InputGroup>
                        {(!sceneNameValid) &&
                            <FormErrorMessage>
                                {sceneNameInUse ? "Szenennname bereits vergeben" : "Szenennname muss zwischen 1 und 32 Zeichen lang sein"}
                            </FormErrorMessage>
                        }
                    </FormControl>
                    <br/>
                    <br/>
                    <FormControl>
                        <FormLabel>Werte der Clients für die Szene</FormLabel>
                        <Box w={'100%'} mb={4} ml={0} maxH={'300px'}
                                overflowY={'auto'}>
                        {groupClients && groupClients[0] !== undefined &&  groupClients[0] !== null ? (
                        <>
                            {groupClients.map((client, index) => {
                                return(
                                    <Flex key={'Scene-Client-' + index} justifyContent='space-between' alignItems='center' w={'90%'} border={'1px solid #000'} borderRadius={'10px'} p={2} m={2} background={'teal.100'}>
                                        <Center maxW={'57%'}>
                                            <Text maxW={'100%'}>{client.name?client.name:generateNameOutOfID(client.id)}</Text>
                                        </Center>
                                        <Spacer/>
                                        <Center>
                                                <Button 
                                                    colorScheme='teal' 
                                                    size='sm' 
                                                    onClick={()=>{
                                                        //switch ignoredPorts
                                                        if(ignoredPorts.includes(client.id)) {
                                                            setIgnoredPorts(ignoredPorts.filter((value) => value !== client.id));
                                                        }
                                                        else {
                                                            setIgnoredPorts([...ignoredPorts, client.id]);
                                                        }
                                                    }} 
                                                    variant={ignoredPorts.includes(client.id)?'solid':'outline'}
                                                >
                                                    {ignoredPorts.includes(client.id)?'ignoriert':'ignorieren'}
                                                </Button>
                                        </Center>
                                        <IconButton
                                            size={'sm'}
                                            variant='outline'
                                            colorScheme='teal'
                                            aria-label='Call Sage'
                                            fontSize='lg'
                                            icon={<EditIcon />}
                                            ml={2}
                                            onClick={()=>{
                                                let temp = scenePortModals;
                                                temp[index] = true;
                                                setScenePortModals(temp);
                                                setRerender(!rerender);
                                            }}
                                        />
                                        <ControllerCommandsModal 
                                            rerender={rerender}
                                            openModal={scenePortModals[index]} 
                                            closeModal={()=>{
                                                console.log('close');
                                                let temp = scenePortModals;
                                                temp[index] = false;
                                                setScenePortModals(temp);
                                                setRerender(!rerender);
                                            }}

                                            client = {client}
                                        />
                                    </Flex>
                                )
                            })}
                        </>
                        ) : (
                            <Text color={'teal.100'}>Keine Clients in der Gruppe</Text>
                        )}
                        </Box>
                        <FormHelperText w={'95%'} >
                            <Heading size={'xs'}>Ignorierte Clients</Heading>
                            Clients die ignoriert oder nach dem Erstellen der Szene hinzugefügt werden, werden beim Ausführen der Szene nicht verändert.
                            <br/>
                            <Heading size={'xs'}>Bearbeiten Knopf</Heading>
                            Hier können Sie die Werte der Clients einstellen, die in der Szene gespeichert werden sollen.
                        </FormHelperText>

                    </FormControl>
                        

                </ModalBody>
    
                <ModalFooter>
                    <Button colorScheme='teal' isDisabled={!sceneNameValid} onClick={()=>{addScene(sceneNameValue)} }  >
                        Hinzufügen
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
        </>
    )
}

export default AddSceneDialog;


