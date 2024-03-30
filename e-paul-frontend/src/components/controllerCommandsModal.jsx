/**
 * Komponente für das Anzeigen und Ausführen von Controller-Befehlen.
 * @component
 * @param {Object} props - Die Eigenschaften für die Komponente.
 * @param {boolean} props.openModal - Gibt an, ob das Modal geöffnet ist oder nicht.
 * @param {function} props.closeModal - Funktion zum Schließen des Modals.
 * @param {Object} props.client - Das Client-Objekt.
 * @returns {JSX.Element} Das ControllerCommandsModal-Komponente.
 * 
 * @requires chakra-ui/react
 * @requires react
 * @requires utils/env
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
    Button,
    Flex,
    Center,
    Text,
    Input,
    Box,
    Spacer,
    Divider,
} from '@chakra-ui/react';
import React, { useState, useEffect, useRef } from 'react';
import { env } from '../utils/env';

//Modal zum Anzeigen und Ausführen von Controller-Befehlen
const ControllerCommandsModal = (props) => {
    const [controllerCommands, setControllerCommands] = useState([]); // [ {name: 'name', command: 'command'}, ...

    const [commands, setCommands] = useState([]); // [ [{key: 'key', value: 'value'}, ...], ...]

    const initialRef = useRef();

    // holt die Controller-Befehle vom Server beim Öffnen des Modals
    useEffect(() => {
        if (!props.openModal) return;
        console.log('fetching controller commands: ', props.client.id);
        fetchControllerCommands();
    }, [props.openModal]);

    // holt die Controller-Befehle vom Server
    const fetchControllerCommands = () => {
        fetch(env()['api-path'] + 'getCommands/' + props.client.id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                console.log(response);
                if (response.status == 200) {
                    return response.json();
                }
                return null;
            })
            .then((data) => {
                if (data) {
                    setControllerCommands(data);
                    console.log('Success:', data);

                    let temp = [];
                    for (let i = 0; i < data.length; i++) {
                        let command = data[i];
                        let commandOption = {};
                        for (
                            let j = 0;
                            j < command['commandOption'].length;
                            j++
                        ) {
                            let option = command['commandOption'][j];
                            commandOption[option['key']] = option['value'];
                            if (option['key'] == 'target') {
                                commandOption[option['key']] = props.client.id;
                            }
                            if (option['static'] == 1) {
                                commandOption[option['key']] = option['value'];
                            }
                        }
                        temp.push(commandOption);
                    }
                    setCommands(temp);
                    console.log('commands:', temp);
                }
            })
            .catch((error) => {
                setControllerCommands([]);
                console.error('Error(getPortCommands):', error);
            });
    };

    // sendet den Befehl an den Server
    const executeCommand = (command) => {
        console.log('executing command: ', command);
        fetch(env()['api-path'] + 'device/executeCommand', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ command: command }),
        })
            .then((response) => {
                console.log(response);
                if (response.status == 200) {
                    return response.json();
                }
                return null;
            })
            .then((data) => {
                if (data) {
                    console.log('Success:', data);
                }
            })
            .catch((error) => {
                console.error('Error(executeCommand):', error);
            });
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
                    <ModalHeader maxW={'90%'}>Controller-Commands</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {controllerCommands.length > 0 &&
                            controllerCommands.map((command, index) => {
                                return (
                                    <Center
                                        key={'command_' + index}
                                        w={'100%'}
                                        mb={2}
                                    >
                                        <Box
                                            w={'90%'}
                                            p={2}
                                            borderWidth={1}
                                            borderColor={'teal.500'}
                                            borderRadius={5}
                                        >
                                            <Flex w={'100%'}>
                                                <Center w={'65%'}>
                                                    <Text w={'100%'}>
                                                        {' '}
                                                        {
                                                            // value of the command['commandOption'] where key is 'command'
                                                            command[
                                                                'commandOption'
                                                            ].find(
                                                                (option) =>
                                                                    option[
                                                                        'key'
                                                                    ] ===
                                                                    'command'
                                                            )['value'] ||
                                                                // if there is no such key, return 'command_{index}' value
                                                                'command_' +
                                                                    index
                                                        }
                                                    </Text>
                                                </Center>
                                                <Spacer />
                                                <Button
                                                    colorScheme='teal'
                                                    onClick={() => {
                                                        executeCommand(
                                                            commands[index]
                                                        );
                                                    }}
                                                >
                                                    Ausführen
                                                </Button>
                                            </Flex>
                                            <Divider
                                                mt={2}
                                                mb={2}
                                                orientation='horizontal'
                                            />
                                            <Text>{command.description}</Text>
                                            <Divider
                                                mt={2}
                                                mb={2}
                                                orientation='horizontal'
                                            />

                                            {command['commandOption'] &&
                                                command['commandOption']
                                                    .length > 0 &&
                                                command['commandOption'].map(
                                                    (option, optIndex) => {
                                                        return (
                                                            <React.Fragment
                                                                key={
                                                                    'commandOption' +
                                                                    index +
                                                                    '_' +
                                                                    optIndex
                                                                }
                                                            >
                                                                {!option.static &&
                                                                    option[
                                                                        'key'
                                                                    ] !==
                                                                        'target' && (
                                                                        <Box
                                                                            w={
                                                                                '100%'
                                                                            }
                                                                            mb={
                                                                                2
                                                                            }
                                                                            p={
                                                                                2
                                                                            }
                                                                            bg={
                                                                                'teal.100'
                                                                            }
                                                                            borderRadius={
                                                                                '10px'
                                                                            }
                                                                        >
                                                                            <Flex>
                                                                                <Center
                                                                                    w={
                                                                                        '50%'
                                                                                    }
                                                                                    minW={
                                                                                        '50%'
                                                                                    }
                                                                                >
                                                                                    <Text
                                                                                        w={
                                                                                            '100%'
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            option[
                                                                                                'key'
                                                                                            ]
                                                                                        }{' '}
                                                                                        :
                                                                                    </Text>
                                                                                </Center>
                                                                                <Spacer />
                                                                                <Input
                                                                                    onChange={(
                                                                                        event
                                                                                    ) => {
                                                                                        let temp =
                                                                                            [
                                                                                                ...commands,
                                                                                            ];
                                                                                        temp[
                                                                                            index
                                                                                        ][
                                                                                            option[
                                                                                                'key'
                                                                                            ]
                                                                                        ] =
                                                                                            event.target.value;
                                                                                        setCommands(
                                                                                            temp
                                                                                        );
                                                                                    }}
                                                                                    placeholder={
                                                                                        option[
                                                                                            'value'
                                                                                        ]
                                                                                    }
                                                                                />
                                                                            </Flex>
                                                                        </Box>
                                                                    )}
                                                            </React.Fragment>
                                                        );
                                                    }
                                                )}
                                        </Box>
                                    </Center>
                                );
                            })}
                    </ModalBody>
                    <ModalFooter>
                        {props.additionalButton &&
                            props.additionalButtonFunction &&
                            props.additionalButtonText && (
                                <Button
                                    key={initialRef}
                                    mr={3}
                                    colorScheme='teal'
                                    onClick={() => {
                                        props.additionalButtonFunction();
                                    }}
                                >
                                    {props.additionalButtonText}
                                </Button>
                            )}
                        <Button
                            mr={3}
                            color={'teal.500'}
                            borderColor={'teal.500'}
                            onClick={() => {
                                props.closeModal();
                            }}
                            variant={'outline'}
                        >
                            Schließen
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default ControllerCommandsModal;
