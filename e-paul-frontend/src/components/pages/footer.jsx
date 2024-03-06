import React, { Component } from "react";
import { Box, Flex, Link, SimpleGrid } from "@chakra-ui/react";

class Footer extends Component {
    render() {
        return (
            <Flex
                bg={"#00697B"}
                position={"fixed"}
                w={"100%"}
                bottom={"0px"}
                h={"50px"}
                borderTop={"1px"}
                borderTopColor={"#f8fafc"}
                alignItems="center"
            >
                <SimpleGrid templateColumns="repeat(3, 1fr)" w={"100%"}>
                    <Box>
                        <Link
                            href="/imprint"
                            pl={"4"}
                            color={"whitesmoke"}
                            _hover={{}}
                            fontWeight={"bold"}
                        >
                            Impressum
                        </Link>
                    </Box>

                    <Box align="center">
                        <Link
                            href="mailto:support@epaul-smarthome.de"
                            color={"whitesmoke"}
                            _hover={{}}
                            fontWeight={"bold"}
                        >
                            Support
                        </Link>
                    </Box>

                    <Box align="end">
                        <Link
                            href="/about"
                            pr={"4"}
                            color={"whitesmoke"}
                            _hover={{}}
                            fontWeight={"bold"}
                        >
                            Über uns
                        </Link>
                    </Box>
                </SimpleGrid>
            </Flex>
        );
    }
}
export default Footer;
