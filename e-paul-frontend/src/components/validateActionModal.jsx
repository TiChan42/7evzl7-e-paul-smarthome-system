import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
} from '@chakra-ui/react';
import React from 'react';

//Modal for signing up and in
const ValidateActionModal = (props) => {
    const initialRef = React.useRef();
    return (
        <>
            <Modal
                initialFocusRef={initialRef}
                isOpen={props.openModal}
                onClose={props.closeModal}
            >
                <ModalOverlay />
                <ModalContent bg={'teal.50'}>
                    <ModalHeader
                        maxW={'90%'}
                        textColor={'red'}
                    >
                        {props.title}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>{props.content}</ModalBody>
                    <ModalFooter>
                        <Button
                            key={initialRef}
                            mr={3}
                            colorScheme='teal'
                            onClick={() => {
                                props.closeModal();
                                props.execute();
                            }}
                        >
                            Bestätigen
                        </Button>
                        <Button
                            mr={3}
                            color={'teal.500'}
                            borderColor={'teal.500'}
                            onClick={() => {
                                props.closeModal();
                            }}
                            variant={'outline'}
                        >
                            Abbrechen
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default ValidateActionModal;
