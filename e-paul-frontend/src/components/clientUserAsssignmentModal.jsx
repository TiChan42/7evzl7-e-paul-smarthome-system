import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Tabs, 
    TabList,
    Tab, 
    Flex,
    Spacer,
    Box,
    Heading,
    Text,
    Avatar,
    Tag,
    TagLabel,
    TagLeftIcon,
    TagRightIcon,
    TagCloseButton,
    Center,
    Button,
    IconButton,
    Square,
    Grid, GridItem ,
    HStack,
    Container,
    Wrap,
    WrapItem,
  } from '@chakra-ui/react'
  import React, {useState,useEffect} from 'react';
  import env from '../env.js';
  import {clientIconPath} from '../clientIconPaths';
  import { ArrowForwardIcon, ArrowBackIcon} from '@chakra-ui/icons'

  //ClientData
const accountClients = [
    {
        id: 1,
        name: 'Client1',
        type: 'lamp'
    },
    {
        id: 2,
        name: 'WWWWWWWWWW',
        type: 'lamp'
    },
    {
        id: 3,
        name: 'Client3',
        type: 'button'
    },
    {
        id: 4,
        name: 'Client4',
        type: 'lamp1'
    }
]
const userClientIDs = [1,3];
//ClientElement
const ClientElement = (props) => {

    
    return (
        
        <Tag size={{base:'sm',sm:'md', md:'lg'}} colorScheme='red' borderRadius='full'  >
            {props.state &&
                <>
                    <Avatar
                        size='sm'
                        name={props.clientType}
                        ml={-1}
                        mr={2}
                        background={'teal.40'}
                        textColor={'teal.900'}
                        src={clientIconPath()[props.clientType]}    
                    />
                        
                    <TagLabel >{props.clientName}</TagLabel>
                </>
                }
                {!props.state &&
                <>
                    {props.clientName.length <= 5 &&
                        <TagLabel >{props.clientName}</TagLabel>
                    }
                    {props.clientName.length > 5 &&
                        <TagLabel >{props.clientName.substring(0,3) + '...'}</TagLabel>
                }
                </>
            }
        </Tag>
    )
}

//ClientListElement
const ClientListElement = (props) => {

    
    return (
        <>
        <Center >
                <Flex m={1} w={'100%'} h={'40px'} background={'teal.100'} borderRadius={'8px'} >
                    {props.variant &&
                        <>
                        <Center p={1}>
                            <IconButton
                                variant='solid'
                                colorScheme='teal'
                                aria-label='Call Sage'
                                fontSize='20px'
                                size='sm'
                                icon={<ArrowBackIcon />}
                            />
                        </Center>
                        <Spacer />
                        </>
                    }   
                    <Box   alignSelf={'center'} >
                        <Box background={'tomato'}>
                            <ClientElement clientName={props.clientName} clientType={props.clientType} state={props.state} />
                        </Box>
                    </Box>
                    {!props.variant &&
                        <>
                        <Spacer />
                        <Center p={1}>
                        <IconButton
                                variant='solid'
                                colorScheme='teal'
                                aria-label='Call Sage'
                                fontSize='20px'
                                size='sm'
                                icon={<ArrowForwardIcon />}
                            />
                    </Center>
                    </>
                    }      
                    
                </Flex>
        </Center>
        </>
    )
}

//ClientList
const ClientList = (props) => {
    const [elementsToShow, setElementsToShow] = useState([]);
    useEffect(() => {
        if(props.variant){
            setElementsToShow(props.clients.filter(client => props.userClientIDs.includes(client.id)));
        }else{
            setElementsToShow(props.clients.filter(client => !props.userClientIDs.includes(client.id)));
        }
    }, [props.clients, props.variant]);
    return (
        <Box borderLeft={props.variant?'1px':'0px'}>
        {elementsToShow.map((client, index) => {
            return (
                <ClientListElement key={index} clientName={client.name} clientType={client.type} state={props.state} variant={props.variant}/>
            )
        })}
        </Box>
    )
}

//Modal for signing up and in
const ClientUserAssignmentModal = (props) => {

    const initialRef = React.useRef();
    const userClientsRef = React.useRef();
    const allClientsRef = React.useRef();

    const [siteState, setSiteState] = useState(1);

    useEffect(() => {
        setSiteState(1);
    }, [props.openModal]);
    

    return (
        <>
        <Modal
        isOpen={props.openModal}
        onClose={props.closeModal}
        initialFocusRef={initialRef}
        >
            <ModalOverlay />
            <ModalContent>
            <Tabs align='start' variant='enclosed' colorScheme='teal' >
                <ModalHeader>
                    <TabList>
                        <Tab ref={userClientsRef} onClick={()=>{setSiteState(1)}}>Alle</Tab>
                        <Tab ref={allClientsRef} onClick={()=>{setSiteState(0)}}>Zugewiesen</Tab>
                    </TabList>
                </ModalHeader>
            </Tabs>
            <ModalCloseButton />
            <ModalBody>
                <Text>Weisen Sie dem Benutzer Clients zu</Text>
                <Flex>
                    <Box  w={siteState?'70%':'30%'} height={'auto'}>
                        <Heading size={'sm'} textAlign={'left'} p={1}>Alle</Heading>
                        <ClientList clients={accountClients} userClientIDs={userClientIDs} state={siteState} variant={false}/>
                    </Box>
                    <Box w={!siteState?'70%':'30%'} height={'auto'}>
                        <Heading size={'sm'} textAlign={'right'} p={1} >Zugewiesen</Heading>
                        <ClientList clients={accountClients} userClientIDs={userClientIDs} state={!siteState} variant={true}/>
                    </Box>
                </Flex>
            </ModalBody>
            <ModalFooter></ModalFooter>
                
            </ModalContent>
        </Modal>
        </>
    )
}

export default ClientUserAssignmentModal;