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
    Input
 } from "@chakra-ui/react"
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import React, { useState, useEffect, useRef } from 'react';

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
            setSelectedItemsWithoutDuplicates(props.preSelectValues.map((value) => props.items.find((item) => item['value'] === value)))
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
    }

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
                        isActive={isOpen}
                        as={Button}
                        rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        w={'100%'}
                        variant={'outline'}
                        borderColor={props.colorScheme}
                        h={'100%'}
                        minH={'40px'}
                        maxH={'210px'}
                        overflowY={'hidden'}
                        onWheel={handleScroll}
                        _hover={{ bg: props.colorScheme + '.150' }}
                        _active={{ bg: props.colorScheme + '.250' }}
                    >
                        {selectedItems[0] ? (
                            <Box
                                w={'100%'}
                                maxH={'210px'}
                                overflowY={'auto'}
                                ref={contentRef} 
                                css={{ '&::-webkit-scrollbar': { display: 'none'}}}
                            >
                                <Wrap mt={2} mb={2}>
                                    {selectedItems.map((item, index) => {
                                        return (
                                            <WrapItem key={'MultiSelect-Preview' + index}>
                                                <Tag bg={props.colorScheme + '.400'}>
                                                    <TagLabel>{item['name']}</TagLabel>
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
                    <MenuList w={'100%'} borderColor={props.colorScheme} maxH ={'250px'} overflow={'hidden'} css={{ '&::-webkit-scrollbar': { display: 'none' } }} bg={props.colorScheme + '.100'}>
                    
                        <Center  mb={2} >
                            <Input
                                focusBorderColor={props.colorScheme+'.500'}
                                size= 'sm'
                                type="text"
                                placeholder="Suche..."
                                borderColor={props.colorScheme+'.200'}
                                _hover={{ borderColor: props.colorScheme+'.300' }}
                                onChange={(event) => {
                                    let search = event.target.value;
                                    let filteredItems = props.items.filter((item) => {
                                        return item['name'].toLowerCase().includes(search.toLowerCase());
                                    });
                                    setItems(filteredItems);
                                }}
                                w={'90%'}
                            />
                        </Center>
                        <Box w={'100%'}>
                            <Checkbox
                                borderBottom={'1px'}
                                borderColor={props.colorScheme+'.500'}
                                w={'100%'}
                                mb={1}
                                onChange={(event) => {
                                    if (event.target.checked) {
                                        setSelectedItemsWithoutDuplicates(items);
                                    } else {
                                        setSelectedItemsWithoutDuplicates([]);
                                    }
                                }}
                                isChecked={selectedItems.length === items.length}
                                colorScheme={props.colorScheme}
                                pl={5}
                                pr={4}
                            >
                                Alle auswählen
                            </Checkbox>
                        </Box>
                        <Box m={2} w={'100%'}overflowY={'auto'} overflowX={'hidden'} maxH={'210px'} __css={{  '&::-webkit-scrollbar': { backgroundColor: 'transparent', width: '3px'}, '&::-webkit-scrollbar-thumb': { backgroundColor: 'teal.600', borderRadius: 'full'}}} pb={'40px'}>
                            
                            {items.map((item, index) => {
                                return (
                                    <Box w={'100%'} key={'MultiSelect-Item'+index}>
                                        <Checkbox
                                            onChange={(event) => {
                                                if (event.target.checked) {
                                                    setSelectedItemsWithoutDuplicates([...selectedItems, item]);
                                                } else {
                                                    setSelectedItemsWithoutDuplicates(selectedItems.filter((value) => value !== item));
                                                }
                                            }}
                                            borderBottom={'1px'}
                                            borderColor={props.colorScheme+'.200'}
                                            w={'90%'}
                                            mb={2}
                                            pb={2}
                                            isChecked={selectedItems.includes(item)}
                                            colorScheme={props.colorScheme}
                                            pl={3}
                                            pr={4}
                                        >
                                            {item['name']}
                                        </Checkbox>
                                    </Box >
                                );
                            })}
                        </Box>
                    </MenuList>
                </Box>
            )}
        </Menu>
    );
}