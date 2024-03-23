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
import {EditIcon } from '@chakra-ui/icons'
import React, { useState, useEffect } from 'react'
import { decryptString } from '@/utils/encryptionUtils'
import {env} from '@/utils/env'
import ControllerCommandsModal from './controllerCommandsModal'



function EditSceneDialog(props) {
    const toast = useToast()

    const { isOpen, onOpen, onClose } = useDisclosure()

    const [rerender, setRerender] = useState(false);

    const [sceneNameInUse, setSceneNameInUse] = useState(false);
    const [sceneNameValid, setSceneNameValid] = useState(false);
    const [sceneNameValue, setSceneNameValue] = useState('');
    const [groupClients, setGroupClients] = useState([])

    const [ignoredPorts, setIgnoredPorts] = useState([])
    const [scenePorts, setScenePorts] = useState([])

    const [scenePortModals, setScenePortModals] = useState([])

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
                setSceneNameValue(sceneName);
                if (sceneNames.includes(sceneName)) {
                    setSceneNameInUse(true);
                }
                else {
                    setSceneNameInUse(false);
                    if (sceneName.length > 0 && sceneName.length <= 32) {
                        changeSceneName(sceneName);
                    }
                }
            })
            .catch((error) => {
                console.error('Error(fetchScenes):', error);
                setSceneNameInUse(true);
            });
        }
    }

    //ändert den Szenennamen
    const changeSceneName = (sceneName) => {
        let userID = decryptString(sessionStorage.getItem('executingUserID'));
        if (userID) {
            fetch(env()["api-path"] + 'group/scene/changeName', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    executingUserId: userID,
                    sceneId: props.scene.id,
                    name: sceneName
                })
            })
            .then(response => {
                if(response.status === 204)
                {   
                    props.reloadScenes();
                    toast.closeAll();
                    toast({
                        title: "Szenennname erfolgreich geändert",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                    })
                }
                else {
                    toast({
                        title: "Szenennname konnte nicht geändert werden",
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                    })
                }
            })
            .catch((error) => {
                console.error('Error(changeSceneName):', error);
                toast({
                    title: "Szenennname konnte nicht geändert werden",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                })
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
        checkSceneNameInUse(value);
    }

    //lädt die Szene
    useEffect(() => {
        if(isOpen){
            //setzt den Szenennamen
            if (props.scene.name) {
                setSceneNameValue(props.scene.name);
            }

            //setzt die ignorierten Ports
            if (props.groupClients && props.groupClients.length > 0) {
                setGroupClients(props.groupClients);
            }
        }
        // eslint-disable-next-line
    }, [isOpen]);

    //lädt die SzenePorts
    useEffect(() => {
        if(isOpen){
            getScenePorts();
        }
        // eslint-disable-next-line
    }, [groupClients]);

    //setzt die ignoredPorts basierend auf den scenePorts
    useEffect(() => {
        if (scenePorts && scenePorts.length > 0) {
            //All clients 
            let clients = props.groupClients.map((client) => client.id);
            let temp = [];
            //für jedes Element in clients
            clients.forEach((client) => {
                //wenn der client nicht in scenePorts ist
                if (!scenePorts.includes(client)) {
                    temp.push(client);
                }
            });
            setIgnoredPorts(temp);

            //für jedes Element in scenePort wird scenePortModals um ein false erweitert
            let temp2 = [];
            groupClients.forEach(() => {
                temp2.push(false);
            });
            setScenePortModals(temp2);
        }
        // eslint-disable-next-line
    }, [scenePorts]);

    //Generiert einen Namen aus der ID
    const generateNameOutOfID = (id) => {
        let temp = (id*2345+id*856+id*71)/(id*id*id)
        //More complex function to generate a name out of the id
        temp = parseInt((temp*2345+temp*856+temp*71)/(id*id)) ;
        return 'Client_'+temp.toString();
    }

    //Holt sich alle gesetzten States der Szene und speichert die State.id in scenePorts
    const getScenePorts = () => {
        fetch(env()["api-path"] + 'group/scene/getPorts/' + props.scene.id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            setScenePorts(data.ids);
        })
        .catch((error) => {
            console.error('Error(changeSceneName):', error);
        });
    }

    //fügt einen Port der Szenen hinzu
    const addPortToScene = (port) => {
        let userID = decryptString(sessionStorage.getItem('executingUserID'));
        if(userID){
            let data = {
                executingUserId: userID,
                sceneId: props.scene.id,
                portId: port
            }
            fetch(env()["api-path"] + 'group/scene/addPort', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if(response.status === 201)
                {
                    setScenePorts([...scenePorts, port]);
                    props.reloadScenes();
                    toast.closeAll();
                    toast({
                        title: "Client erfolgreich hinzugefügt",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                    })
                }
                else {
                    toast({
                        title: "Client konnte nicht hinzugefügt werden",
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                    })
                }
            })
            .catch((error) => {
                console.error('Error(addPortToScene):', error);
                toast({
                    title: "Client konnte nicht hinzugefügt werden",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                })
            });
        }


    }

    //entfernt einen Port aus der Szene
    const removePortFromScene = (port) => {
        let userID = decryptString(sessionStorage.getItem('executingUserID'));
        if(userID){
            let data = {
                executingUserId: userID,
                sceneId: props.scene.id,
                portId: port
            }
            fetch(env()["api-path"] + 'group/scene/removePort', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if(response.status === 204)
                {
                    setScenePorts(scenePorts.filter((scenePort) => scenePort !== port));
                    props.reloadScenes();
                    toast.closeAll();
                    toast({
                        title: "Client erfolgreich ignoriert",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                    })
                }
                else {
                    toast({
                        title: "Client konnte nicht ignoriert werden",
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                    })
                }
            })
            .catch((error) => {
                console.error('Error(removePortFromScene):', error);
                toast({
                    title: "Client konnte nicht ignoriert werden",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                })
            });
        }
    }

    const updateState = (port) => {
        let userID = decryptString(sessionStorage.getItem('executingUserID'));
        if(userID){
            let data = {
                executingUserId: userID,
                sceneId: props.scene.id,
                portId: port
            }
            fetch(env()["api-path"] + 'group/scene/updateState', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if(response.status === 204)
                {
                    toast({
                        title: "Client Status in der Szene erfolgreich aktualisiert",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                    })
                }
                else {
                    toast({
                        title: "Client Status in der Szene konnte nicht aktualisiert werden",
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                    })
                }
            })
            .catch((error) => {
                console.error('Error(clientStatusChange):', error);
                toast({
                    title: "Client Status in der Szene konnte nicht aktualisiert werden",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                })
            });
        }
    }
    

    
    return (
        <>
        <IconButton
            size={'md'}
            variant='outline'
            colorScheme='teal'
            aria-label='Edit'
            fontSize='xl'
            icon={<EditIcon />}
            onClick={onOpen}
            ml={2}
        />
    
        <Modal isOpen={isOpen} onClose={onClose} size={{base:'full' , sm:'md'}}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader w={'90%'}>Szene bearbeiten</ModalHeader>
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
                                                            addPortToScene(client.id)
                                                        }
                                                        else {
                                                            removePortFromScene(client.id)
                                                        }
                                                    }
                                                }
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

                                            additionalButton = {true}
                                            additionalButtonFunction = {() => {
                                                console.log('in Szene übernehmen');
                                                updateState(client.id);
                                            }}
                                            additionalButtonText = {'in Szene übernehmen'}
                                        />

                                    </Flex>
                                )
                            }
                            )}
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
                    <Button onClick={()=>{onClose()} }  >
                        Schließen
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
        </>
    )
}



export default EditSceneDialog;