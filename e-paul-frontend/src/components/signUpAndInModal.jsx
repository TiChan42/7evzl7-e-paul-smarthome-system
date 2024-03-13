import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Tabs, 
    TabList, 
    TabPanels, 
    Tab, 
    TabPanel,
  } from '@chakra-ui/react'
  import React from 'react';
  import SignUpForm from './signUpForm';
  import SignInForm from './signInForm';

//Modal for signing up and in
const SignUpAndInModal = (props) => {

    const initialRef = React.useRef();
    const signInRef = React.useRef();

    const switchToSignIn = () => {
        signInRef.current.click();
    }

    return (
        <>
        <Modal
        isOpen={props.openModal}
        onClose={props.closeModal}
        initialFocusRef={initialRef}
        >
            <ModalOverlay />
            <ModalContent>
            <Tabs align='start' variant='enclosed' colorScheme='teal' defaultIndex={props.entrySite} isLazy={true} >
                <ModalHeader>
                    <TabList>
                        <Tab onMouseDown={(e) => e.preventDefault()}>Registrieren</Tab>
                        <Tab ref={signInRef} onMouseDown={(e) => e.preventDefault()}>Anmelden</Tab>
                    </TabList>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <TabPanels>
                        <TabPanel >
                            <SignUpForm initialRef={initialRef} executeSuccessfulSignUp={() => {switchToSignIn(); props.onSignUp();}}/>
                        </TabPanel>
                        <TabPanel >
                            <SignInForm initialRef={initialRef} executeSuccessfulSignIn={() => {props.onSignIn();}}/>

                        </TabPanel>
                    </TabPanels>
                </ModalBody>
                <ModalFooter></ModalFooter>
            </Tabs>
                
            </ModalContent>
        </Modal>
        </>
    )
}

export default SignUpAndInModal;