import React, { Component } from 'react';
import { Flex, Link } from '@chakra-ui/react';

class Footer extends Component {
    render() { 
        return (  
            <Flex bg={"#00697B"} position={'fixed'} w={"100%"} bottom={"0px"} justifyContent="space-between" h={'4vh'} minHeight={'50px'} borderTop={"1px"} borderTopColor={"#f8fafc"}>
                <Link href="/imprint" p={"3"} color={'whitesmoke'} _hover={{}} fontWeight={'bold'}>Impressum</Link>
                <Link href="/about" p={"3"} color={'whitesmoke'} _hover={{}} fontWeight={'bold'}>Über uns</Link>
            </Flex> 
        );
    }
}
export default Footer;
