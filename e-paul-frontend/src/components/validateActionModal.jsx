
/**
 * Komponente für ein Modal zur Nachfrage, ob eine Aktion wirklich ausgeführt werden soll.
 * 
 * @component
 * 
 * @param {Object} props - Die Eigenschaften der Komponente.
 * @param {boolean} props.openModal - Gibt an, ob das Modal geöffnet ist oder nicht.
 * @param {function} props.closeModal - Eine Funktion zum Schließen des Modals.
 * @param {string} props.title - Der Titel des Modals.
 * @param {string} props.content - Der Inhalt des Modals.
 * @param {function} props.execute - Eine Funktion zum Ausführen der Aktion.
 * 
 * @returns {JSX.Element} Das Modal zur Validierung der Aktion.
 * 
 * @requires chakra-ui/react
 * @requires react
 */
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

//Modal zur Nachfrage, ob eine Aktion wirklich ausgeführt werden soll
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
