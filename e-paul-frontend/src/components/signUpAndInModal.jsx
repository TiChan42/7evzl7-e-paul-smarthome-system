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
  import SignUpForm from '@/components/signUpForm';
  import SignInForm from '@/components/signInForm';

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
            <ModalContent bg={'teal.50'}>
            <Tabs align='start' variant='enclosed' colorScheme='teal' defaultIndex={props.entrySite} isLazy={true} >
                <ModalHeader>
                    <TabList borderColor={'teal.200'} colorScheme='teal'>
                        <Tab 
                            onMouseDown={(e) => e.preventDefault()}
                            _selected={{borderBottomColor: 'teal.50', borderTopColor: 'teal.200', borderLeftColor: 'teal.200', borderRightColor: 'teal.200', color: 'teal.500'}}
                        >
                            Registrieren
                        </Tab>
                        <Tab 
                            ref={signInRef} 
                            onMouseDown={(e) => e.preventDefault()} 
                            _selected={{borderBottomColor: 'teal.50', borderTopColor: 'teal.200', borderLeftColor: 'teal.200', borderRightColor: 'teal.200', color: 'teal.500'}}
                        >
                            Anmelden
                        </Tab>
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