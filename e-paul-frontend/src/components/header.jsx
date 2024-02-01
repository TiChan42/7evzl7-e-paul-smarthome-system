import React, { Component } from 'react';
import { Box, Flex, Button, Spacer, Text, Image, Link } from '@chakra-ui/react';
import './header.css'

class Header extends Component {
    state = {  } 

    render() { 
        return (
                <Flex bg={"#218395"} alignItems="center">
                    <Link href="/" display={"flex"} p={"2"} alignItems="center">
                        <Image src="assets/img/clearLogoWhite.png" alt="Logo" width="30" height="30" display={'inline-block'} m={"1"}/>
                        <Text color={"white"} fontSize={"xl"} as={"b"} display={'inline-block'} _hover={{}}> E-Paul</Text>
                    </Link>

                    <Spacer/>

                    <Box p={"2"}>
                        <Link href="/signin">
                            <Button colorScheme='teal' variant='solid' mr={2} >
                                Sign up
                            </Button>
                        </Link>
                        
                        <Link href="/login">
                            <Button colorScheme='whiteAlpha' variant='solid'>
                                Log in
                            </Button>
                        </Link>
                    </Box>
                </Flex>
  );
};
}
 
export default Header;
