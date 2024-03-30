

/**
 * Komponente für die Mehrfachauswahl.
 * 
 * @component
 * @param {Object} props - Die Eigenschaften der Komponente.
 * @param {Array} props.items - Die Liste der Elemente zur Auswahl.
 * @param {Array} props.preSelectValues - Die vorab ausgewählten Werte.
 * @param {string} props.colorScheme - Das Farbschema der Komponente.
 * @param {string} props.placeHolder - Der Platzhaltertext, der angezeigt wird, wenn keine Elemente ausgewählt sind.
 * @param {function} props.onSelect - Die Callback-Funktion, die aufgerufen wird, wenn Elemente ausgewählt werden.
 * @returns {JSX.Element} Die gerenderte Mehrfachauswahl-Komponente.
 * @require chakra-ui/react
 * @require react
 * 
 */
import {
    Button,
    Menu,
    MenuButton,
    MenuList,
    Tag,
    TagLabel,
    Wrap,
    WrapItem,
    Box,
    Checkbox,
    Center,
    Input,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import React, { useState, useEffect, useRef } from 'react';

//MultiSelect Komponente
export default function MultiSelect(props) {
    const [selectedItems, setSelectedItems] = useState([]);
    const [items, setItems] = useState(props.items);
    const [changeInit, setChangeInit] = useState(true);
    const contentRef = useRef(null);

    const handleScroll = (event) => {
        const { deltaY } = event;
        const contentElement = contentRef.current;
        if (contentElement) {
            contentElement.scrollTop += deltaY;
        }
    };

    //setzt am anfang die selectetItems auf die Items mit den Values von props.preSelectValues
    useEffect(() => {
        setChangeInit(true);
        if (props.preSelectValues && props.preSelectValues.length > 0) {
            setSelectedItemsWithoutDuplicates(
                props.preSelectValues.map((value) =>
                    props.items.find((item) => item['value'] === value)
                )
            );
        }
        // eslint-disable-next-line
    }, []);

    //setzt selectetItems ohne Duplikate
    const setSelectedItemsWithoutDuplicates = (items) => {
        let result = [];
        items.forEach((item) => {
            if (!result.includes(item)) {
                result.push(item);
            }
        });
        setSelectedItems(result);
    };

    //lädt die Items neu, wenn sich die props.items ändern
    useEffect(() => {
        if (changeInit) {
            setChangeInit(false);
        } else {
            props.onSelect(selectedItems);
        }
        // eslint-disable-next-line
    }, [selectedItems]);

    return (
        <Menu w={'100%'}>
            {({ isOpen }) => (
                <Box w={'100%'}>
                    <MenuButton
                        as={Button}
                        overflowY={'hidden'}
                        w={'100%'}
                        h={'100%'}
                        minH={'40px'}
                        maxH={'210px'}
                        borderColor={props.colorScheme}
                        _hover={{ bg: props.colorScheme + '.150' }}
                        _active={{ bg: props.colorScheme + '.250' }}
                        isActive={isOpen}
                        onWheel={handleScroll}
                        rightIcon={
                            isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />
                        }
                        variant={'outline'}
                    >
                        {selectedItems[0] ? (
                            <Box
                                ref={contentRef}
                                overflowY={'auto'}
                                w={'100%'}
                                maxH={'210px'}
                                css={{
                                    '&::-webkit-scrollbar': { display: 'none' },
                                }}
                            >
                                <Wrap
                                    mt={2}
                                    mb={2}
                                >
                                    {selectedItems.map((item, index) => {
                                        return (
                                            <WrapItem
                                                key={
                                                    'MultiSelect-Preview' +
                                                    index
                                                }
                                            >
                                                <Tag
                                                    bg={
                                                        props.colorScheme +
                                                        '.400'
                                                    }
                                                >
                                                    <TagLabel>
                                                        {item['name']}
                                                    </TagLabel>
                                                </Tag>
                                            </WrapItem>
                                        );
                                    })}
                                </Wrap>
                            </Box>
                        ) : (
                            <>{props.placeHolder}</>
                        )}
                    </MenuButton>
                    <MenuList
                        overflow={'hidden'}
                        w={'100%'}
                        maxH={'250px'}
                        bg={props.colorScheme + '.100'}
                        borderColor={props.colorScheme}
                        css={{ '&::-webkit-scrollbar': { display: 'none' } }}
                    >
                        <Center mb={2}>
                            <Input
                                w={'90%'}
                                borderColor={props.colorScheme + '.200'}
                                _hover={{
                                    borderColor: props.colorScheme + '.300',
                                }}
                                focusBorderColor={props.colorScheme + '.500'}
                                onChange={(event) => {
                                    let search = event.target.value;
                                    let filteredItems = props.items.filter(
                                        (item) => {
                                            return item['name']
                                                .toLowerCase()
                                                .includes(search.toLowerCase());
                                        }
                                    );
                                    setItems(filteredItems);
                                }}
                                placeholder='Suche...'
                                size='sm'
                                type='text'
                            />
                        </Center>
                        <Box w={'100%'}>
                            <Checkbox
                                w={'100%'}
                                mb={1}
                                pr={4}
                                pl={5}
                                borderColor={props.colorScheme + '.500'}
                                borderBottom={'1px'}
                                colorScheme={props.colorScheme}
                                isChecked={
                                    selectedItems.length === items.length
                                }
                                onChange={(event) => {
                                    if (event.target.checked) {
                                        setSelectedItemsWithoutDuplicates(
                                            items
                                        );
                                    } else {
                                        setSelectedItemsWithoutDuplicates([]);
                                    }
                                }}
                            >
                                Alle auswählen
                            </Checkbox>
                        </Box>
                        <Box
                            overflowX={'hidden'}
                            overflowY={'auto'}
                            w={'100%'}
                            maxH={'210px'}
                            m={2}
                            pb={'40px'}
                            __css={{
                                '&::-webkit-scrollbar': {
                                    backgroundColor: 'transparent',
                                    width: '3px',
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    backgroundColor: 'teal.600',
                                    borderRadius: 'full',
                                },
                            }}
                        >
                            {items.map((item, index) => {
                                return (
                                    <Box
                                        key={'MultiSelect-Item' + index}
                                        w={'100%'}
                                    >
                                        <Checkbox
                                            w={'90%'}
                                            mb={2}
                                            pr={4}
                                            pb={2}
                                            pl={3}
                                            borderColor={
                                                props.colorScheme + '.200'
                                            }
                                            borderBottom={'1px'}
                                            colorScheme={props.colorScheme}
                                            isChecked={selectedItems.includes(
                                                item
                                            )}
                                            onChange={(event) => {
                                                if (event.target.checked) {
                                                    setSelectedItemsWithoutDuplicates(
                                                        [...selectedItems, item]
                                                    );
                                                } else {
                                                    setSelectedItemsWithoutDuplicates(
                                                        selectedItems.filter(
                                                            (value) =>
                                                                value !== item
                                                        )
                                                    );
                                                }
                                            }}
                                        >
                                            {item['name']}
                                        </Checkbox>
                                    </Box>
                                );
                            })}
                        </Box>
                    </MenuList>
                </Box>
            )}
        </Menu>
    );
}
