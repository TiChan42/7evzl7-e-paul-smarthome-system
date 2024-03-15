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
Input
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import MultiSelect from '@/components/multiselect'


function AddGroupDialog({devices}) {
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
            <ModalHeader>Gruppe Hinzufügen</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Input placeholder='Gruppenname'>
                </Input>
                <br/> <br/>
                <MultiSelect Bezeichnung="Geräte" groupOptions={[devices]}></MultiSelect>
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
  
  export default AddGroupDialog;