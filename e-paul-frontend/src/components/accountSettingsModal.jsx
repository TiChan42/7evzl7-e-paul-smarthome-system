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
import { decryptString } from '@/utils/encryptionUtils';

//Modal for signing up and in
const AccountSettingsModal = (props) => {

    //AccountId
    const [accountID, setAccountID] = React.useState(decryptString(sessionStorage.getItem('accountID')))

    //Hier die ganzen Funktionen Hinpacken 


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
                <ModalHeader >
                    Account-Einstellungen
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    Hier könnte Ihr Inhalt stehen @Linus
                </ModalBody>
                <ModalFooter>
                    <Button key={initialRef} mr={3} onClick={()=>{props.closeModal()}}>
                        Schließen
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
        </>
    )
}

export default AccountSettingsModal;