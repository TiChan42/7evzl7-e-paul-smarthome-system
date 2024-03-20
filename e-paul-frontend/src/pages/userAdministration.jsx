import React, { useState, useEffect } from 'react';
import { Heading, Grid, GridItem, CloseButton, Button, ButtonGroup, useToast, Box, HStack, VStack, StackDivider, IconButton, Flex, Spacer} from '@chakra-ui/react';
import {env} from '@/utils/env';
import { encryptString, decryptString } from '@/utils/encryptionUtils';
import {DeleteIcon, EditIcon, AddIcon} from '@chakra-ui/icons';
import { Avatar } from "@chakra-ui/avatar";
import ValidateActionModal from '@/components/validateActionModal';
import AddUserModal from '@/components/addUserModal';
import ClientUserAssignmentModal from '@/components/clientUserAsssignmentModal';
import { FaMicrochip } from "react-icons/fa6";
import { ImSection } from "react-icons/im";
import UserRightSettingsModal from '@/components/userRightSettingsModal';
import AccountSettingsModal from '@/components/accountSettingsModal';


var userRightsTest = [
    {
        "mayChangeUserSettings": 1,
        "mayDeleteUser": 1,
        "mayAssignController": 1,
        "mayChangeUserType": 0,
        "mayChangeUserRights": 1,

        "mayAddUser": 1,
        "mayChangeAccountSettings": 1,

        "mayChangeOwnUserSettings": 0,
        "mayDeleteSelf": 1,

        "mayEditControllers": 1,
        "mayDeleteControllers": 1

    }
]

function Header() {
	const[siteBefore,setSiteBefore] = useState(window.history.length-1)
return <header>
<Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}> 
<h1>Benutzerverwaltung</h1> 
<CloseButton onClick={()=>{sessionStorage.setItem('userAuthorized', encryptString('false')); window.history.go(siteBefore-window.history.length)}}/>
</Box>
</header>;
}
  
function UserCol(props) {
	const editRights = props.editRights
    const[isAdmin,setIsAdmin] = useState(props.user.role==='admin'||props.user.role==='superuser')
	const [userModuleModal, setUserModuleModal] = useState(false)
	const [userRightModal, setUserRightModal] = useState(false)

	const toast = useToast()

	function deleteUser() {
		if (decryptString(sessionStorage.getItem('userAuthorized'))==='false'){
			return
		}
		let executingUser = decryptString(sessionStorage.getItem('executingUserID'))
		let accountID = decryptString(sessionStorage.getItem('accountID'))
		let deletePath = env()["api-path"] + "user/deleteUser";

		let data = {
			userId: props.user.id,
			executingUserId: executingUser,
			accountId: accountID
		}

		let requestOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data)
		}
		

		fetch(deletePath, requestOptions)
		  .then(response => {
			console.log(response.status)
				if (response.status >= 400){
					toast({
						title: 'Löschen fehlgeschlagen',
						description: 'Das Löschen von '+props.user.username+' ist fehlgeschlagen',
						status: 'error',
						duration: 7000,
						isClosable: true,
					});
				} else {
					toast({
						title: 'Löschen von '+props.user.username+' erfolgreich',
						status: 'success',
						duration: 5000,
						isClosable: true,
					});
					props.refresh()
				}	
		  })
		  .catch(error => {
			  toast({
				  title: 'Löschen fehlgeschlagen',
				  status: 'error',
				  duration: 7000,
				  isClosable: true,
			  });
		  });
	  };

    const deleteUserModal = () => {
        props.openValidateModal(props.user.username + ' löschen?',
        'Sind Sie sich sicher, dass Sie '+props.user.username+' löschen möchten? Diese Veränderung kann nicht mehr rückgängig gemacht werden!',
        ()=>{
		  deleteUser();
      }) 
    }

	const updateAdminStatus = (userID, admin) => {
		let url = env()["api-path"] + 'user/changeRole'
		let adminData = 'user'
		if (admin){
			adminData = 'admin'
		}
		let data = {
			userId: userID,
			role: adminData,
			executingUserId: decryptString(sessionStorage.getItem('executingUserID'))
		}
		fetch(url, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data)
		})
		.then(response => {
			if(response.status === 204){
				toast({
					title: 'Erfolgreich',
					description: 'Der Adminstatus von '+props.user.username+' wurde erfolgreich geändert',
					status: 'success',
					isClosable: true,
					duration: 5000
				})
				setIsAdmin(admin)
				props.refresh()
			}else{
				toast({
					title: 'Fehler',
					description: 'Während der Verarbeitung ist ein Fehler aufgetreten, versuchen Sie es erneut',
					status: 'error',
					isClosable: true,
					duration: 7000
				})
			}
		})
		.catch((error) => {
			console.error('Error:', error);
			toast({
				title: 'Fehler',
				description: 'Während der Verarbeitung ist ein Fehler aufgetreten, versuchen Sie es erneut',
				status: 'error',
				isClosable: true,
				duration: 7000
			})
		});
	}

    const handleAdminSwitch = () => {
		if (isAdmin) {
			props.openValidateModal('Adminstatus von '+props.user.username+' ändern?',
			'Sind Sie sich sicher, dass Sie '+props.user.username+' zu einem Standardbenutzer degradieren möchten?',
			()=>{
				updateAdminStatus(props.user.id, false)
			})
		}else{
			props.openValidateModal('Adminstatus von '+props.user.username+' ändern?',
			'Sind Sie sich sicher, dass Sie '+props.user.username+' zu einem Administrator ernennen möchten?',
			()=>{
				updateAdminStatus(props.user.id, true)
			})
		}
    }

	const handleUserSettingClick = (id) => {
		sessionStorage.setItem('userToEdit',encryptString(id.toString()))
		window.location.href = '/settings'
	}

    return (
    	<Flex minWidth='max-content' alignItems='center' gap='2'>
			<HStack p='2'>
				<Avatar
				size='sm'
				name={props.user.username}
				src={env()["user-profile-images-path"] + props.user.userImageName}
				/>
				<Heading size='sm'>{'  '+props.user.username}</Heading>
			</HStack>
			<Spacer />
			<Box>
				<ButtonGroup variant='outline' gap='2'>

					<Button isDisabled={!editRights['mayChangeUserType'] || props.user.role==='superuser'} colorScheme='teal' variant={isAdmin?'solid':'outline'} onClick={()=>{handleAdminSwitch()}}>
						Admin
					</Button>
					
					<IconButton isDisabled={!editRights['mayChangeUserSettings'] || props.user.role==='superuser'} icon={<EditIcon/>} onClick={()=>{handleUserSettingClick(props.user.id)}} colorScheme="teal" variant="solid"></IconButton>
					<IconButton isDisabled={!editRights['mayDeleteUser'] || props.user.role==='superuser'} icon={<DeleteIcon/>} onClick={() => {deleteUserModal()}} colorScheme="teal" variant="solid"></IconButton>
					<IconButton isDisabled={!editRights['mayAssignController'] || props.user.role==='superuser'} icon={<FaMicrochip/>} onClick={() => setUserModuleModal(true)} colorScheme="teal" variant="solid"></IconButton>
					<IconButton isDisabled={!editRights['mayChangeUserRights'] || props.user.role==='superuser'} icon={<ImSection/>} onClick={()=> setUserRightModal(true)} colorScheme="teal" variant="solid"></IconButton>

					<UserRightSettingsModal openModal={userRightModal} closeModal={() => setUserRightModal(false)} userID={props.user.id.toString()} userRole={props.user.role} userName={props.user.username}/>
					<ClientUserAssignmentModal openModal={userModuleModal} closeModal={() => setUserModuleModal(false)} userID={props.user.id} userName={props.user.username}/>
				</ButtonGroup>
			</Box>
		</Flex>
    );
}

//Haupt function
function UserAdministration() {
    const accountID = decryptString(sessionStorage.getItem("accountID")); 
    const [addUserModal, setAddUserModal] = useState(false);
	const [accountSettingModal, setAccountSettingModal] = useState(false);
	const [editRights, setEditRights] = useState(userRightsTest[0]); //zum testen

	const handleUserSettingClick = () => {
		sessionStorage.setItem('userToEdit',sessionStorage.getItem('executingUserID'))
		window.location.href = '/settings'
	}

	const triggerRefresh = () => {
		fetchUsers(accountID)
	}

    const toast = useToast()
    const [users, setUsers] = useState(null);
    useEffect(()=>{
    	fetchUsers(accountID)
		//eslint-disable-next-line
    },[accountID]); //Variablen die es auslösen

    const[validationModal,setValidationModal] = useState()
    const[validationModalText,setValidationModalText] = useState()
    const[validationModalTitle,setValidationModalTitle] = useState()
    const [validationModalAction, setValidationModalAction] = useState(()=>{return ()=>{}})
    
    function openValidationModal(validationModalTitle, validationModalText, pvalidationModalAction){
      setValidationModalTitle(validationModalTitle)
      setValidationModalText(validationModalText)
      setValidationModalAction(()=>{return pvalidationModalAction})
      setValidationModal(true)
    }

    
	function fetchUsers(accountID) {
      //fetch users from backend
      //später auf 0 prüfen und dann nicht laden
		const fetchPath = env()["api-path"] + "getUsers/" + accountID;
		fetch(fetchPath, {method: "GET"})
			.then(response => {
				return response.json();
			})
			.then(data => {
				setUsers(data["user"]);
				if (data["user"][0] == null) {
					console.log('Kein Benutzer vorhanden')
				}
			})
			.catch(error => {
				console.error('Error:', error);
				toast({
					title: 'error',
					status: 'error',
					isClosable: true,
				});
        });
    };

	const getUserRights = async () => {
	
		let executingUserID = decryptString(sessionStorage.getItem('executingUserID'))

		if (executingUserID != null){

			//setEditRights(userRightsTest[0]) //rauslöschen sobald es im backend steht
			
			let url = env()["api-path"] + 'getUserRights/' + executingUserID + '/' + executingUserID
			await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				}
			})
			.then(response => {
				if(response.status === 200){
					return response.json()
				}
				else if (response.status === 403){
					toast({
						title: 'Nicht berechtigt',
						description: 'Sie sind nicht berechtigt, die Benutzerrechte dieses Benutzers zu bearbeiten',
						status: 'error',
						isClosable: true,
						duration: 5000
					})
					return null
				}
				toast({
					title: 'Fehler',
					description: 'Während der Verarbeitung ist ein Fehler aufgetreten, versuchen Sie es erneut',
					status: 'error',
					isClosable: true,
					duration: 5000
				})
				return null
			})
			.then(data => {
				if(data != null){
					setEditRights(data)
				}
			})
			.catch((error) => {
				console.error('Error:', error);
				toast({
					title: 'Fehler',
					description: 'Während der Verarbeitung ist ein Fehler aufgetreten, versuchen Sie es erneut',
					status: 'error',
					isClosable: true,
					duration: 7000
				})
			});
			
		}
	}
	// eslint-disable-next-line
	useEffect(() => {getUserRights()}, [])



    return (
		<> 
		<Grid
		templateAreas={`"header header" "main main"`}
		gridTemplateRows={'50px 1fr 30px'}
		gridTemplateColumns={'150px 1fr'}
		h=''
		gap='1'
		color='blackAlpha.700'
		fontWeight='bold'>  
		{/* Header*/}
		<GridItem pl='2' area={'header'}>
		<Header />
		</GridItem>

		{/* Main*/}
		
		<GridItem pl='2' area={'main'}>

		<VStack
		divider={<StackDivider borderColor='gray.200' />}
		spacing={4}
		align='stretch'
		>
		{users && users[0] &&
		<>
			{Object.keys(users).map((key, index) => (
				<Box key={index} width={'100%'} borderRadius={'xl'} background={'teal.50'} m={1} mb={2} p={2}>
					<UserCol openValidateModal={(a,b,c)=>{openValidationModal(a,b,c)}} user={users[key]} editRights={editRights} refresh={() => {triggerRefresh()}}/>
				</Box>
			))}
		</>
		}
		</VStack>
		</GridItem>
		</Grid>
		<Box m='2'>
		<Button rightIcon={<AddIcon/>}
            colorScheme="teal" m='1'
			isDisabled={!editRights['mayAddUser']}
            onClick={()=>{setAddUserModal(true)}}>Benutzer hinzufügen</Button>
		<Button colorScheme="teal" m='1'
		isDisabled={!editRights['mayChangeAccountSettings']}
		onClick={()=>{setAccountSettingModal(true)}}>Kontoeinstellungen</Button>
		<Button colorScheme="teal" m='1'
		isDisabled={!editRights['mayChangeOwnUserSettings']}
		onClick={()=>{handleUserSettingClick()}}>Eigene Benutzereinstellungen öffnen</Button>
		</Box>
		<AccountSettingsModal openModal = {accountSettingModal} closeModal = {()=>{setAccountSettingModal(false)}}/>
		<AddUserModal openModal = {addUserModal} closeModal = {()=>{setAddUserModal(false); triggerRefresh()}} accountID = {decryptString(sessionStorage.getItem("accountID"))}/>
		
	<ValidateActionModal openModal = {validationModal} closeModal = {()=>{setValidationModal(false)}} title = {validationModalTitle} content = {validationModalText} execute = {()=>{validationModalAction()}}/>
		</>
    );
}
  
export default UserAdministration;