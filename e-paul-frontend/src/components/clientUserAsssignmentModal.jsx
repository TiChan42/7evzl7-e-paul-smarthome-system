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
    TabPanels, 
    Tab, 
    TabPanel,
  } from '@chakra-ui/react'
  import React from 'react';

//Modal for signing up and in
const ClientUserAssignmentModal = (props) => {

    const initialRef = React.useRef();
    const userClientsRef = React.useRef();
    const allClientsRef = React.useRef();
    

    return (
        <>
        <Modal
        isOpen={props.openModal}
        onClose={props.closeModal}
        initialFocusRef={initialRef}
        >
            <ModalOverlay />
            <ModalContent>
            <Tabs align='start' variant='enclosed' colorScheme='teal' defaultIndex={props.entrySite} isLazy={true} >
                <ModalHeader>
                    <TabList>
                        <Tab ref={userClientsRef}>Benutzer</Tab>
                        <Tab ref={allClientsRef}>Clients</Tab>
                    </TabList>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <TabPanels>
                        <TabPanel >
                        </TabPanel>
                        <TabPanel >

                        </TabPanel>
                    </TabPanels>
                </ModalBody>
                <ModalFooter></ModalFooter>
            </Tabs>
                
            </ModalContent>
        </Modal>
        </>
    )
}

export default ClientUserAssignmentModal;