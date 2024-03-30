import {
    CloseButton,
    Text,
    Heading,
    Box,
    Card,
    Button,
    VStack,
    Stack,
    CardHeader,
    Image,
    Input,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Select,
    InputGroup,
    InputRightElement,
    useToast,
    Flex,
} from '@chakra-ui/react';
import { decryptString } from '../utils/encryptionUtils';
import React, { Component, useEffect } from 'react';

//Modal zum Löschen eines Users
function DeleteUserModal() {
    const executingUserID = sessionStorage.getItem('executingUserID');
    const accountID = decryptString(sessionStorage.getItem('accountID'));
    const userID = decryptString(sessionStorage.getItem('userToEdit'));
    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const deleteUser = async () => {
        console.log(executingUserID, accountID, userID);
        const res = await fetch(
            'http://epaul-smarthome.de:8000/api/user/deleteUser',
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userID,
                    accountId: accountID,
                    executingUserId: executingUserID,
                }),
            }
        );
    };

    return (
        <>
            <Button
                m='2em'
                colorScheme='red'
                onClick={onOpen}
                variant='solid'
            >
                User löschen
            </Button>
            <Modal
                finalFocusRef={finalRef}
                initialFocusRef={initialRef}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        Möchten sie ihren User wirklich löschen?
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}></ModalBody>
                    <ModalFooter>
                        <Button
                            mr='1em'
                            colorScheme='red'
                            onClick={deleteUser}
                            variant='solid'
                        >
                            Bestätigen
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

// hinzufügen eines Toasts
function AddToast(props) {
    const toast = useToast();
    useEffect(() => {
        if (props.trigger) {
            if (
                props.title &&
                props.status &&
                props.duration &&
                props.isClosable &&
                props.description
            ) {
                toast({
                    title: props.title,
                    status: props.status,
                    duration: props.duration,
                    isClosable: props.isClosable,
                    description: props.description,
                });
                props.afterTrigger();
            }
        }
    });

    return <></>;
}

class Settings extends Component {
    state = {
        activeTab: 'allgemein',
        isModalOpen: false,
        toastTitle: '123',
        toastStatus: 'error',
        toastDuration: 5000,
        toastIsClosable: true,
        toastDescription: 'descr',
        openToastTrigger: false,
        username: '',
    };
    executingUserID = decryptString(sessionStorage.getItem('executingUserID'));
    accountID = decryptString(sessionStorage.getItem('accountID'));
    userID = decryptString(sessionStorage.getItem('userToEdit'));

    constructor() {
        super();
        this.getUsername = this.getUsername.bind(this);
    }

    async getUsername() {
        const res = await fetch(
            'http://epaul-smarthome.de:8000/api/user/' + this.userID,
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            }
        );
        var name = await res.json();
        this.setState({ username: name.username });
    }

    componentDidMount() {
        this.getUsername();
    }

    renderContent() {
        const { activeTab } = this.state;

        const updateUsername = async () => {
            if (this.state.newUsername) {
                const res = await fetch(
                    'http://epaul-smarthome.de:8000/api/settings/changeUserInformation',
                    {
                        method: 'PUT',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            accountId: this.accountID,
                            userId: this.userID,
                            username: this.state.newUsername,
                            executingUserId: this.executingUserID,
                        }),
                    }
                );
                if (res.status == 204) {
                    console.log('Erfolg');
                    this.setState({
                        toastTitle: 'Erfolg!',
                        toastDescription:
                            'Ihr Benutzername wurde erfolgreich geändert.',
                        toastStatus: 'success',
                        toastIsClosable: true,
                        toastDuration: 5000,
                        openToastTrigger: true,
                    });
                    this.getUsername();
                } else {
                    var message = await res.json();
                    if (message.error == 'Username existiert bereits.') {
                        console.log('Username existiert bereits');
                        this.setState({
                            toastTitle: 'Ungültige Eingabe',
                            toastDescription:
                                'Dieser Username existiert bereits.',
                            toastStatus: 'error',
                            toastIsClosable: true,
                            toastDuration: 5000,
                            openToastTrigger: true,
                        });
                    } else {
                        console.log('fehler');
                        this.setState({
                            toastTitle: 'Fehler',
                            toastDescription: 'Es ist ein Fehler aufgetreten.',
                            toastStatus: 'error',
                            toastIsClosable: true,
                            toastDuration: 5000,
                            openToastTrigger: true,
                        });
                    }
                }
            } else {
                this.setState({
                    toastTitle: 'Ungültige Eingabe',
                    toastDescription: 'Sie haben das Feld leer gelassen.',
                    toastStatus: 'error',
                    toastIsClosable: true,
                    toastDuration: 5000,
                    openToastTrigger: true,
                });
            }
        };

        const updateGender = async () => {
            const res = await fetch(
                'http://epaul-smarthome.de:8000/api/settings/changeUserInformation',
                {
                    method: 'PUT',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        accountId: this.accountID,
                        userId: this.userID,
                        executingUserId: this.executingUserID,
                        gender: this.state.newGender,
                    }),
                }
            );
            this.setState({
                toastTitle: 'Erfolg!',
                toastDescription: 'Ihr Geschlecht wurde geändert.',
                toastStatus: 'success',
                toastIsClosable: true,
                toastDuration: 5000,
                openToastTrigger: true,
            });
        };

        const validatePin = async () => {
            const res = await fetch(
                'http://epaul-smarthome.de:8000/api/validatePin',
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        accountId: this.accountID,
                        userId: this.userID,
                        pin: this.state.oldPin,
                    }),
                }
            );
            return res;
        };

        const updatePin = async () => {
            var validated = await validatePin();
            try {
                validated = await validated.json();
            } catch (error) {
                console.log(error);
            }
            validated = validated['valid'];
            if (this.state.newPin == this.state.newPinRepeat) {
                if (validated == 1) {
                    console.log(String(this.state.newPin));
                    this.setState({ wrongPinOpen: false });
                    const res = await fetch(
                        'http://epaul-smarthome.de:8000/api/settings/pin',
                        {
                            method: 'PUT',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                userId: this.userID,
                                executingUserId: this.executingUserID,
                                pin: this.state.newPin,
                            }),
                        }
                    );

                    this.state.toastTitle = 'Erfolg!';
                    this.state.toastDescription =
                        'Ihr PIN wurde erfolgreich geändert.';
                    this.state.toastStatus = 'success';
                    this.state.toastIsClosable = true;
                    this.state.toastDuration = 7000;
                    this.state.openToastTrigger = true;
                } else {
                    // Invalid Old Pin
                    this.setState({ wrongPinOpen: true });
                    console.log('old pin is not valid');
                    this.state.toastTitle = 'PIN ist falsch!';
                    this.state.toastDescription =
                        'Ihr eingegebener PIN ist falsch. Bitte versuchen Sie es erneut.';
                    this.state.toastStatus = 'error';
                    this.state.toastIsClosable = true;
                    this.state.toastDuration = 7000;
                    this.state.openToastTrigger = true;
                }
                this.setState({ diffPinOpen: false });
            } else {
                // Pins are different
                this.state.toastTitle = 'PINs sind verschieden!';
                this.state.toastDescription =
                    'Geben Sie zwei mal den gleichen PIN ein, um diesen zu ändern.';
                this.state.toastStaus = 'error';
                this.state.toastIsClosable = true;
                this.state.toastDuration = 7000;
                this.state.openToastTrigger = true;
                this.setState({ diffPinOpen: true });
                console.log('new pins are different');
            }
        };

        if (activeTab === 'allgemein') {
            return (
                <>
                    <AddToast
                        onChange={'update'}
                        title={this.state.toastTitle}
                        status={this.state.toastStatus}
                        duration={this.state.toastDuration}
                        isClosable={this.state.toastIsClosable}
                        description={this.state.toastDescription}
                        trigger={this.state.openToastTrigger}
                        afterTrigger={() => {
                            this.state.openToastTrigger = false;
                        }}
                    />
                    <Card
                        w='100%'
                        h='100%'
                        bg={'#218395'}
                    >
                        <CardHeader>
                            <Heading
                                color={'white'}
                                size='lg'
                            >
                                Allgemein
                            </Heading>
                        </CardHeader>
                        <Box m={4}>
                            <Text color={'white'}>
                                Hier können Sie Ihren Benutzernamen ändern:
                            </Text>
                            <Input
                                mt={'1em'}
                                _placeholder={{ color: 'white' }}
                                errorBorderColor='white'
                                focusBorderColor={'red'}
                                isInvalid
                                onChange={(e) =>
                                    this.setState({
                                        newUsername: e.target.value,
                                    })
                                }
                                placeholder='Neuer Benutzername'
                                type='text'
                                value={this.state.newUsername}
                            />
                            <Button
                                align={'left'}
                                m={'2em'}
                                fontSize={[12, 12, 16]}
                                colorScheme='whiteAlpha'
                                onClick={updateUsername}
                                variant='solid'
                            >
                                Benutzernamen aktualisieren
                            </Button>
                        </Box>

                        <Box m={4}>
                            <Text color={'white'}>
                                Hier können Sie Ihr Geschlecht ändern:
                            </Text>
                            <Select
                                mt={'1em'}
                                borderColor={'white'}
                                errorBorderColor='white'
                                focusBorderColor={'red'}
                                onChange={(e) =>
                                    this.setState({ newGender: e.target.value })
                                }
                                placeholder='Geschlecht wählen'
                                value={this.state.newGender}
                            >
                                <option value='männlich'>männlich</option>
                                <option value='weiblich'>weiblich</option>
                                <option value='divers'>divers</option>
                            </Select>
                            <Button
                                align={'left'}
                                m={'2em'}
                                fontSize={[12, 12, 16]}
                                colorScheme='whiteAlpha'
                                onClick={updateGender}
                                variant='solid'
                            >
                                Geschlecht bestätigen
                            </Button>
                            <br></br>
                            <br></br>
                            <Text color={'white'}>
                                Hier können Sie Ihren User löschen:
                            </Text>
                            <DeleteUserModal />
                        </Box>
                    </Card>
                </>
            );
        } else if (activeTab === 'pin') {
            return (
                <>
                    <AddToast
                        title={this.state.toastTitle}
                        status={this.state.toastStatus}
                        duration={this.state.toastDuration}
                        isClosable={this.state.toastIsClosable}
                        description={this.state.toastDescription}
                        trigger={this.state.openToastTrigger}
                        afterTrigger={() => {
                            this.state.openToastTrigger = false;
                        }}
                    />
                    <Card
                        w='100%'
                        h='100%'
                        bg={'#218395'}
                    >
                        <CardHeader>
                            <Heading
                                color={'white'}
                                size='lg'
                            >
                                PIN
                            </Heading>
                        </CardHeader>
                        <Box
                            w={'80%'}
                            m={'4'}
                        >
                            <Text color={'white'}>
                                Hier können Sie Ihren PIN ändern:
                            </Text>
                            <Stack
                                pt={'3'}
                                spacing={'3'}
                            >
                                <PasswordInput
                                    text='Alter PIN'
                                    pinName='oldPin'
                                    class={this}
                                />
                                <Text color={'white'}>
                                    Hier nun den neuen gewünschten PIN eingeben
                                </Text>
                                <PasswordInput
                                    text='Neuer PIN'
                                    pinName='newPin'
                                    class={this}
                                />
                                <PasswordInput
                                    text='Neuen PIN Bestätigen'
                                    pinName='newPinRepeat'
                                    class={this}
                                />
                            </Stack>
                            <Button
                                align={'left'}
                                m={'2em'}
                                fontSize={[12, 12, 16]}
                                colorScheme='whiteAlpha'
                                onClick={updatePin}
                                variant='solid'
                            >
                                Bestätigen
                            </Button>
                        </Box>
                    </Card>
                </>
            );
        }
    }

    render() {
        const { activeTab } = this.state;
        return (
            <>
                <Header />
                <Flex
                    direction='row'
                    h='100vh'
                    m={'1em'}
                    bg={'teal.250'}
                    borderRadius={'16px'}
                >
                    <Box
                        w='25%'
                        p={4}
                    >
                        <VStack alignItems='center'>
                            <Image src='../../assets/img/paul.png' />
                            <Heading>{this.state.username}</Heading>
                            <Button
                                w={'80%'}
                                colorScheme={
                                    activeTab === 'allgemein' ? 'blue' : 'gray'
                                }
                                onClick={() =>
                                    this.setState({ activeTab: 'allgemein' })
                                }
                            >
                                Allgemein
                            </Button>
                            <Button
                                w={'80%'}
                                colorScheme={
                                    activeTab === 'pin' ? 'blue' : 'gray'
                                }
                                onClick={() =>
                                    this.setState({ activeTab: 'pin' })
                                }
                            >
                                PIN
                            </Button>
                            
                        </VStack>
                    </Box>
                    <Box
                        w='75%'
                        p={4}
                    >
                        {this.renderContent()}
                    </Box>
                </Flex>
            </>
        );
    }
}

export default Settings;

//Header Komponente
function Header() {
    const siteBefore = window.history.length - 1;
    return (
        <header>
            <Box
                style={{
                    display: 'flex',
                    justifyContent: 'right',
                    alignItems: 'right',
                }}
            >
                <CloseButton
                    onClick={() => {
                        window.history.go(siteBefore - window.history.length);
                    }}
                />
            </Box>
        </header>
    );
}
//PasswordInput Komponente
export function PasswordInput(props) {
    const [show, setShow] = React.useState(false);
    const handleClick = () => setShow(!show);

    return (
        <InputGroup size='md'>
            <Input
                pr='4.5rem'
                _placeholder={{ color: 'white' }}
                focusBorderColor='black'
                onChange={(e) =>
                    props.class.setState({ [props.pinName]: e.target.value })
                }
                placeholder={props.text}
                type={show ? 'text' : 'password'}
            />
            <InputRightElement w='4.5rem'>
                <Button
                    h='1.75rem'
                    onClick={handleClick}
                    size='sm'
                >
                    {show ? 'Hide' : 'Show'}
                </Button>
            </InputRightElement>
        </InputGroup>
    );
}
