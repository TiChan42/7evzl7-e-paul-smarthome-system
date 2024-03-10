import React, { useState, useEffect } from 'react';
import { Heading, Grid, GridItem, CloseButton, Button, ButtonGroup, useToast, Box, HStack, VStack, StackDivider, IconButton, Flex, Spacer} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import {env} from '../../env';
import { encryptString, decryptString } from '../../encryptionUtils';
import {DeleteIcon, EditIcon, AddIcon} from '@chakra-ui/icons';
import { Avatar } from "@chakra-ui/avatar";
import ValidateActionModal from '../validateActionModal';
import AddUserModal from '../addUserModal';
import ClientUserAssignmentModal from '../clientUserAsssignmentModal';


function Header() {
return <header>
<Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}> 
<h1>Benutzerverwaltung</h1> 
<Link to="/chooseuser"><CloseButton onClick={()=>{sessionStorage.setItem('userAuthorized', encryptString('false'))}}/></Link>
</Box>
</header>;
}
  
function UserCol(props) {
    const[isAdmin,setIsAdmin] = useState(true) //zum testen
    const[edit,makeEdit] = useState()
    const[isdelete,setdelete] = useState(false)
    const[userClient, setUserClientModal] = useState() 
	const [userModuleModal, setUserModuleModal] = useState(false)
	const toast = useToast()

	function deleteUser() {
		if (decryptString(sessionStorage.getItem('userAuthorized'))=='false'){
			return
		}
		var executingUser = decryptString(sessionStorage.getItem('executingUserID'))
		const deletePath = env()["api-path"] + "user/" + props.user.id;
		fetch(deletePath, {method: "DELETE"})
		  .then(response => {
				console.log(response); // HTTP-Response ausgeben
				if (response.status >= 400){
					toast({
						title: 'Löschen fehlgeschlagen',
						status: 'Du hast keine Berechtigung diesen Nutzer zu löschen',
						isClosable: true,
					});
				}
		  })
		  .catch(error => {
			  console.log('ausgeführt')
			  toast({
				  title: 'error',
				  status: 'error',
				  isClosable: true,
			  });
		  });
	  };

    const deleteUserModal = () => {
        props.openValidateModal('Nutzer löschen?',
        'Sind Sie sich sicher, dass Sie diesen Benutzer löschen möchten? Diese Veränderung kann nicht mehr rückgängig gemacht werden!',
        ()=>{
          setdelete(true)
		  console.log('hier')
          //User im Backend löschen
		  deleteUser();
		  window.location.reload();
      })
    }

    const handleAdminSwitch = () => {
		if (isAdmin) {
			props.openValidateModal('Adminstatus ändern?',
			'Sind Sie sich sicher, dass Sie diesen Admin zu einem Standardbenutzer degradieren möchten?',
			()=>{
			setIsAdmin(false) 
			// Status in Backend ändern
			})
		}else{
			props.openValidateModal('Adminstatus ändern?',
			'Sind Sie sich sicher, dass Sie diesen Benutzer zu einem Administrator ernennen möchten?',
			()=>{
			setIsAdmin(true) 
			// Status in Backend ändern
			})
		}
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
					<Button colorScheme='teal' variant={isAdmin?'solid':'outline'} onClick={()=>{handleAdminSwitch()}}>
						Admin
					</Button>
					<IconButton icon={<EditIcon/>}></IconButton>
					<IconButton icon={<DeleteIcon/>} onClick={() => {deleteUserModal()}}></IconButton>
					<Button onClick={() => setUserModuleModal(true)}>Clientrechte</Button>
					<ClientUserAssignmentModal openModal={userModuleModal} closeModal={() => setUserModuleModal(false)} userID={props.user.id}/>
				</ButtonGroup>
			</Box>
		</Flex>
    );
}

//Haupt function
function UserAdministration() {
    const accountID = decryptString(sessionStorage.getItem("accountID")); 
    const [addUserModal, setAddUserModal] = useState(false);

    const toast = useToast()
    const [users, setUsers] = useState(null);
    useEffect(()=>{
    	fetchUsers(accountID)
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

    //fetch users from backend
    function fetchUsers(accountID) {
      //fetch users from backend
      //später auf 0 prüfen und dann nicht laden
      const fetchPath = env()["api-path"] + "getUser/" + accountID;
      console.log(fetchPath);
      fetch(fetchPath, {method: "GET"})
        .then(response => {
          	console.log(response); // HTTP-Response ausgeben
          	return response.json();
        })
        .then(data => {
          	console.log(data);
          	setUsers(data["user"]);
			if (data["user"][0] == null) {
				console.log('Kein Benutzer vorhanden')
			}
        })
        .catch(error => {
			console.log('ausgeführt')
			toast({
				title: 'error',
				status: 'error',
				isClosable: true,
			});
        });
    };
	 function fetchUsers(accountID) {
      //fetch users from backend
      //später auf 0 prüfen und dann nicht laden
      const fetchPath = env()["api-path"] + "getUser/" + accountID;
      console.log(fetchPath);
      fetch(fetchPath, {method: "GET"})
        .then(response => {
          	console.log(response); // HTTP-Response ausgeben
          	return response.json();
        })
        .then(data => {
          	console.log(data);
          	setUsers(data["user"]);
			if (data["user"][0] == null) {
				console.log('Kein Benutzer vorhanden')
			}
        })
        .catch(error => {
			console.log('ausgeführt')
			toast({
				title: 'error',
				status: 'error',
				isClosable: true,
			});
        });
    };

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
		
		<GridItem pl='2' bg='white' area={'main'}>

		<VStack
		divider={<StackDivider borderColor='gray.200' />}
		spacing={4}
		align='stretch'
		>
		{users && users[0] &&
		<>
			{Object.keys(users).map((key, index) => (
			<UserCol key={index} openValidateModal={(a,b,c)=>{openValidationModal(a,b,c)}} user={users[key]}/>
			))}
		</>
		}
		</VStack>
		</GridItem>
		</Grid>
		<Button rightIcon={<AddIcon/>}
            colorScheme="teal"
            onClick={()=>{setAddUserModal(true)}}>Benutzer hinzufügen</Button>
		<AddUserModal openModal = {addUserModal} closeModal = {()=>{setAddUserModal(false)}} accountID = {decryptString(sessionStorage.getItem("accountID"))}/>
		
	<ValidateActionModal openModal = {validationModal} closeModal = {()=>{setValidationModal(false)}} title = {validationModalTitle} content = {validationModalText} execute = {()=>{validationModalAction()}}/>
		</>
    );
}
  
export default UserAdministration;
