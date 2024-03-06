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
            <ModalContent>
                <ModalHeader textColor={'red'}>
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
                    <Button mr={3} onClick={props.closeModal}>
                        Abbrechen
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
        </>
    )
}

export default ValidateActionModal;