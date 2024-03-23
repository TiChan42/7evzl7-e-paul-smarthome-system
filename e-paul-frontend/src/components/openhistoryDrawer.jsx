import { Button, Drawer, DrawerBody, DrawerHeader, DrawerContent, DrawerOverlay, useDisclosure } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';

function OpenHistoryDrawer(props) {
    const { isOpen, onOpen, onClose } = useDisclosure()
  
    return (
    <>
        <Button onClick={onOpen} background="#3e5f74" color="white"><HamburgerIcon m={1} /> {props.Text} </Button>
        <Drawer placement='right' onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader borderBottomWidth='1px'>Verlauf</DrawerHeader>
            <DrawerBody>
              <p>Some contents...</p>
              <p>Some contents...</p>
              <p>Some contents...</p>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    )
}
export default OpenHistoryDrawer;