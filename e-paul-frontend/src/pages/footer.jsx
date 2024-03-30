
import React, { Component } from 'react';
import { Box, Flex, Link, SimpleGrid } from '@chakra-ui/react';

/**
 * Komponente für den Footer der Seite.
 */
class Footer extends Component {
    /**
     * Render-Methode für den Footer.
     * @returns {JSX.Element} Das gerenderte Footer-Element.
     */
    render() {
        return (
            <Flex
                pos={'fixed'}
                bottom={'0px'}
                align='center'
                w={'100%'}
                h={'50px'}
                bg={'#00697B'}
                borderTop={'1px'}
                borderTopColor={'#f8fafc'}
            >
                <SimpleGrid
                    templateColumns='repeat(3, 1fr)'
                    w={'100%'}
                >
                    <Box>
                        <Link
                            pl={'4'}
                            color={'whitesmoke'}
                            fontWeight={'bold'}
                            _hover={{}}
                            href='/imprint'
                        >
                            Impressum
                        </Link>
                    </Box>

                    <Box align='center'>
                        <Link
                            color={'whitesmoke'}
                            fontWeight={'bold'}
                            _hover={{}}
                            href='mailto:support@epaul-smarthome.de'
                        >
                            Support
                        </Link>
                    </Box>

                    <Box align='end'>
                        <Link
                            pr={'4'}
                            color={'whitesmoke'}
                            fontWeight={'bold'}
                            _hover={{}}
                            href='/about'
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
