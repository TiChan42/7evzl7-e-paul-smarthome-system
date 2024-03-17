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
    Center
 } from "@chakra-ui/react"
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import React, { useState, useEffect, useRef } from 'react';

export default function MultiSelect(props) {
    const [selectedItems, setSelectedItems] = useState([]);
    const [items, setItems] = useState(props.items);
    const contentRef = useRef(null);

    const handleScroll = (event) => {
        const { deltaY } = event;
        const contentElement = contentRef.current;
        if (contentElement) {
            contentElement.scrollTop += deltaY;
        }
    };

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
                                                <Tag colorScheme={props.colorScheme}>
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
                    <MenuList w={'100%'} borderColor={props.colorScheme} maxH ={'250px'} overflow={'hidden'} css={{ '&::-webkit-scrollbar': { display: 'none' } }}>
                    
                        <Box w={'100%'} mb={2} ml={5} >
                            <input
                                type="text"
                                placeholder="Suche..."
                                borderColor={props.colorScheme+'.500'}
                                onChange={(event) => {
                                    let search = event.target.value;
                                    let filteredItems = props.items.filter((item) => {
                                        return item['name'].toLowerCase().includes(search.toLowerCase());
                                    });
                                    setItems(filteredItems);
                                }}
                                w={'60px'}
                                p={2}
                            />
                        </Box>
                        <Box w={'100%'}>
                            <Checkbox
                                borderBottom={'1px'}
                                borderColor={props.colorScheme+'.500'}
                                w={'100%'}
                                mb={1}
                                onChange={(event) => {
                                    if (event.target.checked) {
                                        setSelectedItems(items);
                                    } else {
                                        setSelectedItems([]);
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
                        <Box m={2} w={'100%'}overflowY={'auto'} overflowX={'hidden'} maxH={'210px'} css={{ '&::-webkit-scrollbar': { display: 'none' }}} pb={'40px'}>
                            
                            {items.map((item, index) => {
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