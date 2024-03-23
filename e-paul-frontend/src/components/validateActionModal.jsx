import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
  } from '@chakra-ui/react'
  import React from 'react';

//Modal for signing up and in
const ValidateActionModal = (props) => {

    const initialRef = React.useRef();
    return (
        <>
        <Modal
        isOpen={props.openModal}
        onClose={props.closeModal}
        initialFocusRef={initialRef}
        >
            <ModalOverlay />
            <ModalContent bg={'teal.50'}>
                <ModalHeader textColor={'red'} maxW={'90%'}>
                    {props.title}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {props.content}
                </ModalBody>
                <ModalFooter>
                    <Button key={initialRef} colorScheme="teal" mr={3} onClick={()=>{props.closeModal(); props.execute();}}>
                        Bestätigen
                    </Button>
                    <Button mr={3} onClick={()=>{props.closeModal()}} variant={'outline'} borderColor={'teal.500'} color={'teal.500'}>
                        Abbrechen
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
        </>
    )
}

export default ValidateActionModal;