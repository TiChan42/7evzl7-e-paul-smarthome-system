import React, { Component, useState, useEffect } from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import '../../style.css'
import {Center,Box,Heading, Button} from '@chakra-ui/react'
import ClientUserAssignmentModal from '../clientUserAsssignmentModal';
import { env } from '../../env'
import { encryptString, decryptString } from '../../encryptionUtils';
import AccountSettingsModal from '../accountSettingsModal';
import UserRightSettingsModal from '../userRightSettingsModal';

function SignUpControllerButton(){
	const signUpController = () => {
		console.log("Sign Up Controller")
		let url = 'signUp/microcontroller'
		let data= {
			"email": "user",
			"password": "password",
			"name": "name"
		}
		fetch(env()["api-path"] + url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data)
		})
		.then(response => response.json())
		.then(data => {
			console.log('Success:', data);
		})
		.catch((error) => {
			console.error('Error:', error);
		});
	}

	return (
		<Button onClick={() => signUpController()}> Add Controller to account in Code</Button>
	)
}

function Modals () {
	const [userModuleModal, setUserModuleModal] = useState(false)
	const [userRightsModal, setUserRightsModal] = useState(false)
	const [accountSettingsModal, setAccountSettingsModal] = useState(false)


	useEffect(() => {	
		sessionStorage.setItem('accountID', encryptString('1'))
	}, [])

	return (
		<>
			<Button onClick={() => setUserModuleModal(true)}>Benutzer-Modul</Button>
			<ClientUserAssignmentModal openModal={userModuleModal} closeModal={() => setUserModuleModal(false)} userID={1}/>
			<SignUpControllerButton />
			<Button variant='outline' colorScheme='teal' onClick={() => setAccountSettingsModal(true)}>Account einstellungen</Button>
			<AccountSettingsModal openModal={accountSettingsModal} closeModal={() => setAccountSettingsModal(false)}/>
			<Button onClick={() => setUserRightsModal(true)}>Benutzer-Rechte</Button>
			<UserRightSettingsModal openModal={userRightsModal} closeModal={() => setUserRightsModal(false)} userID = {'4'} userRole={'admin'}/>
		</>
	)
}

// form zum Editieren der AccountID und der Benutzerid für den Executing benutzer
function AccountIDForm(){
	const [newAccountID, setNewAccountID] = useState(decryptString(sessionStorage.getItem('accountID')))
	const [newExecutingUserID, setNewExecutingUserID] = useState(decryptString(sessionStorage.getItem('executingUserID')))

	const submitHandler = (e) => {
		e.preventDefault()
		sessionStorage.setItem('accountID', encryptString(newAccountID))
		sessionStorage.setItem('executingUserID', encryptString(newExecutingUserID))
	}

	return (
		<form onSubmit={submitHandler}>
			<label>
				AccountID:
				<input type="text" value={newAccountID} onChange={(e) => setNewAccountID(e.target.value)} />
			</label>
			<br/>
			<br/>
			<label>
				ExecutingUserID:
				<input type="text" value={newExecutingUserID} onChange={(e) => setNewExecutingUserID(e.target.value)} />
			</label>
			<br/>
			<br/>
			<Button type="submit" value="Submit" colorScheme='teal'>Submit</Button>
		</form>
	)
}


class ModalTest extends Component {
	render() {
		return (
			<Center>
				<Box width={{base: '100%', sm: '85%', xl: '80%', '2xl':'75%'}}>
					<Heading textAlign={"center"} fontSize={'3xl'} pt={20} textColor={'teal.900'}>Hier werden die Modals getestet</Heading>
					<br/>
					<AccountIDForm />
					<br/>
					<Modals />
				</Box>
            </Center>
		);
	}
}

export default ModalTest;