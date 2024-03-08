import React, { Component, useState, useEffect } from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import '../../style.css'
import {Center,Box,Heading, Button} from '@chakra-ui/react'
import ClientUserAssignmentModal from '../clientUserAsssignmentModal';

function Modals () {
	const [userModuleModal, setUserModuleModal] = useState(false)

	return (
		<>
			<Button onClick={() => setUserModuleModal(true)}>Benutzer-Modul</Button>
			<ClientUserAssignmentModal openModal={userModuleModal} closeModal={() => setUserModuleModal(false)} />
		</>
	)
}


class ModalTest extends Component {
	render() {
		return (
			<Center>
				<Box width={{base: '100%', sm: '85%', xl: '80%', '2xl':'75%'}}>
					<Heading textAlign={"center"} fontSize={'3xl'} pt={20} textColor={'teal.900'}>Hier werden die Modals getestet</Heading>
					<br/>
					<Modals />
				</Box>
            </Center>
		);
	}
}

export default ModalTest;
