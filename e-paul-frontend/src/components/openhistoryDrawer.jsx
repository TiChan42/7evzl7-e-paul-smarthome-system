import { Button, Drawer, DrawerBody, DrawerHeader, DrawerContent, DrawerOverlay, useDisclosure } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';

function OpenHistoryDrawer() {
    const { isOpen, onOpen, onClose } = useDisclosure()
  
    return (
    <>
        <Button onClick={onOpen} colorScheme="blackAlpha"><HamburgerIcon></HamburgerIcon> Verlauf </Button>
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