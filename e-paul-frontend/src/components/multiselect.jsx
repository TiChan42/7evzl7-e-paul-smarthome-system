import React from 'react';
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
    Checkbox
 } from "@chakra-ui/react"
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import { useState, useEffect } from 'react';


export default function MultiSelect(props) {
    
    const [selectedItems, setSelectedItems] = useState([])

    useEffect(() => {
        props.onSelect(selectedItems);
        // eslint-disable-next-line 
    }, [selectedItems]);

    return (
        <Menu w={'100%'}>
        {({ isOpen }) => (
            <>
            <MenuButton isActive={isOpen} as={Button} rightIcon={isOpen?<ChevronUpIcon />:<ChevronDownIcon />} w={'100%'} variant={'outline'} borderColor={props.colorScheme} maxH={'auto'}>
                    {selectedItems[0] ? (
                    <Wrap mt={2} mb={2}>
                        {selectedItems.map((item, index) => {
                            return (
                                <WrapItem key={'MultiSelect-Preview'+index} >
                                    <Tag colorScheme={props.colorScheme} >
                                        <TagLabel>{item['name']}</TagLabel>
                                    </Tag>
                                </WrapItem>
                            );
                        })}
                    </Wrap>
                    ) : (
                        <>Auswahl der Clients</>
                    )}
            </MenuButton>
            <MenuList w={'100%'} borderColor={props.colorScheme} >
                <Box w={'100%'}>
                    <Box m={2} >
                        <Box w={'100%'}>
                        <Checkbox
                            borderBottom={'1px'}
                            borderColor={props.colorScheme+'.500'}
                            w={'100%'}
                            mb={3}
                            onChange={(event) => {
                                if (event.target.checked) {
                                    setSelectedItems(props.items);
                                } else {
                                    setSelectedItems([]);
                                }
                            }}
                            isChecked={selectedItems.length === props.items.length}
                            colorScheme={props.colorScheme}
                            pl={3}
                        >
                            Alle auswählen
                        </Checkbox>
                        </Box>
                        {props.items.map((item, index) => {
                            return (
                                <Box w={'100%'} key={'MultiSelect-Item'+index}>
                                <Checkbox
                                    onChange={(event) => {
                                        if (event.target.checked) {
                                            setSelectedItems([...selectedItems, item]);
                                        } else {
                                            setSelectedItems(selectedItems.filter((value) => value !== item));
                                        }
                                    }}
                                    borderBottom={'1px'}
                                    borderColor={props.colorScheme+'.100'}
                                    w={'100%'}
                                    mb={2}
                                    pb={2}
                                    isChecked={selectedItems.includes(item)}
                                    colorScheme={props.colorScheme}
                                    pl={3}
                                >
                                    {item['name']}
                                </Checkbox>
                                </Box >
                            );
                        })}
                    </Box>
                </Box>
            </MenuList>
            </>
        )}
        </Menu>
    );
}