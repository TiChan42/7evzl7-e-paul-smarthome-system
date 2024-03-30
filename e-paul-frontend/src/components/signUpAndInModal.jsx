
/**
 * Komponente für das Modal zur Registrierung und Anmeldung.
 *
 * @param {Object} props - Die Eigenschaften der Komponente.
 * @param {boolean} props.openModal - Gibt an, ob das Modal geöffnet ist oder nicht.
 * @param {function} props.closeModal - Funktion zum Schließen des Modals.
 * @param {number} props.entrySite - Der Standardindex für die Registerkarte (0 für Registrieren, 1 für Anmelden).
 * @param {function} props.onSignUp - Funktion, die aufgerufen wird, wenn die Registrierung erfolgreich abgeschlossen wurde.
 * @param {function} props.onSignIn - Funktion, die aufgerufen wird, wenn die Anmeldung erfolgreich abgeschlossen wurde.
 * @returns {JSX.Element} Das JSX-Element der SignUpAndInModal-Komponente.
 * @requires chakra-ui/react
 * @requires react
 * @requires SignUpForm
 * @requires SignInForm
 * 
 */
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
} from '@chakra-ui/react';
import React from 'react';
import SignUpForm from './signUpForm';
import SignInForm from './signInForm';

//Modal für die Registrierung und Anmeldung
const SignUpAndInModal = (props) => {
    const initialRef = React.useRef();
    const signInRef = React.useRef();

    const switchToSignIn = () => {
        signInRef.current.click();
    };

    return (
        <>
            <Modal
                initialFocusRef={initialRef}
                isOpen={props.openModal}
                onClose={props.closeModal}
            >
                <ModalOverlay />
                <ModalContent bg={'teal.50'}>
                    <Tabs
                        align='start'
                        color='teal'
                        defaultIndex={props.entrySite}
                        isLazy={true}
                        variant='enclosed'
                    >
                        <ModalHeader>
                            <TabList
                                borderColor={'teal.200'}
                                color='teal'
                            >
                                <Tab
                                    _selected={{
                                        borderBottomColor: 'teal.50',
                                        borderTopColor: 'teal.200',
                                        borderLeftColor: 'teal.200',
                                        borderRightColor: 'teal.200',
                                        color: 'teal.500',
                                    }}
                                    onMouseDown={(e) => e.preventDefault()}
                                >
                                    Registrieren
                                </Tab>
                                <Tab
                                    ref={signInRef}
                                    _selected={{
                                        borderBottomColor: 'teal.50',
                                        borderTopColor: 'teal.200',
                                        borderLeftColor: 'teal.200',
                                        borderRightColor: 'teal.200',
                                        color: 'teal.500',
                                    }}
                                    onMouseDown={(e) => e.preventDefault()}
                                >
                                    Anmelden
                                </Tab>
                            </TabList>
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <TabPanels>
                                <TabPanel>
                                    <SignUpForm
                                        initialRef={initialRef}
                                        executeSuccessfulSignUp={() => {
                                            switchToSignIn();
                                            props.onSignUp();
                                        }}
                                    />
                                </TabPanel>
                                <TabPanel>
                                    <SignInForm
                                        initialRef={initialRef}
                                        executeSuccessfulSignIn={() => {
                                            props.onSignIn();
                                        }}
                                    />
                                </TabPanel>
                            </TabPanels>
                        </ModalBody>
                        <ModalFooter></ModalFooter>
                    </Tabs>
                </ModalContent>
            </Modal>
        </>
    );
};

export default SignUpAndInModal;
