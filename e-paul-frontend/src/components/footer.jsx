import React, { Component } from 'react';
import { Flex, Link } from '@chakra-ui/react';

class Footer extends Component {
    state = {  } 
    render() { 
        return (
            <Flex bg={"#218395"} bottom={0} position={'fixed'} w={"100%"}> 
                    <Link href="/about" p={"2"} color={'whitesmoke'}>About us</Link>
            </Flex>
        );
    }
}
 
export default Footer;
