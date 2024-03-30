import {
    Button,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerContent,
    DrawerOverlay,
    useDisclosure,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';

//Drawer für den Verlauf
function OpenHistoryDrawer(props) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Button
                color='white'
                bg='#3e5f74'
                onClick={onOpen}
                isDisabled
            >
                <HamburgerIcon m={1} /> {props.Text}{' '}
            </Button>
            <Drawer
                isOpen={isOpen}
                onClose={onClose}
                placement='right'
            >
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
    );
}
export default OpenHistoryDrawer;
