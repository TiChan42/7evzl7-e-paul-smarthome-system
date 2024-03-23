import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button
  } from '@chakra-ui/react'
  import { AddIcon } from '@chakra-ui/icons'


function AddDeviceDialog() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
      <>
        <Button onClick={onOpen}>
            <AddIcon mr={2}></AddIcon>
            Hinzufügen
        </Button>
  
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Gerät Hinzufügen</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                abcdefg
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
  
  export default AddDeviceDialog;