import React, { Component } from 'react';
import { Flex, Link } from '@chakra-ui/react';

class Footer extends Component {
    state = {  } 
    render() { 
        return (
            <>
                <Flex bg={"#218395"} position={'sticky'} w={"100%"} bottom={"0px"}>
                        <Link href="/about" p={"2"} color={'whitesmoke'} _hover={{}}>About us</Link>
                </Flex>
            </>
        );
    }
}

export default Footer;
