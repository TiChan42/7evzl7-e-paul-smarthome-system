import React, { Component,useState, useEffect } from 'react';
import {Box, Text, Center, Spinner,Wrap,WrapItem,useDisclosure} from "@chakra-ui/react";
import {Avatar} from "@chakra-ui/avatar";
import { encryptString, decryptString } from '../../encryptionUtils';
import UserPinRequestModal from '../userPinRequestModal';

//local test presets (dont needed at server)
sessionStorage.setItem('accountID', encryptString('1'));

function Users(isTest) {
  const userImageFolder = "assets/img/user_profile_images/";

  //Test Array für Benutzer
  const user = {
    user1: {
      profileImagePath: "user_profile_1.jpg",
      name: "Paul56789012",
      id: 1
    },
    user2: {
      profileImagePath: "user_profile_2.jpg",
      name: "WWWWWWWWWWWW",
      id: 2
    },
    user3: {
      profileImagePath: "user_profile_3.jpg",
      name: "XXXXXXXXXXXX",
      id: 3
    },
    user4: {
      profileImagePath: "user_profile_4.jpg",
      name: "YYYYYYYYYYYY",
      id: 4
    },
    user5: {
      profileImagePath: "user_profile_5.jpg",
      name: "ZZZZZZZZZZZZ",
      id: 5
    },
    user6: {
      profileImagePath: "user_profile_6.jpg",
      name: "AAAAAAAAAAAA",
      id: 6
    },
    user7: {
      profileImagePath: "user_profile_7.jpg",
      name: "BBBBBBBBBBBB",
      id: 7
    }

  };

  //Benutzerliste
  const [users, setUsers] = useState(null);

  //Referenzen auf die Pin-Modals Array
  const pinModals = [React.createRef(),React.createRef(),React.createRef(),React.createRef(),React.createRef(),React.createRef(),React.createRef()];
  const userAdministrationPinModal = React.createRef();
  let accountID = decryptString(sessionStorage.getItem('accountID').toString());

  

  
  //setzt den Nutzer
  useEffect(() => {
    if(isTest){
      setUsers(user);
    }else{
      setUsers(user);
    }
    console.log(users);
    

  }, []);

  //prüft ob ein Pin benötigt wird
  const checkPinNeeded = (id) => {
    //fetch user from backend
    //if user needs pin, return true
    //else return false
    return true;
  };

  //Benutzer wird in der Session gespeichert und die Seite wird auf die Übersichtsseite weitergeleitet
  const switchToUserMainPage = (id) => {
    const encryptedId = encryptString(id.toString());
    sessionStorage.setItem("executingUserID", encryptedId);
    window.location.href = "/devices";
  };

  //wenn auf Benutzereinstellungen geklickt wird
  const openUserSettings = () => {
    console.log(userAdministrationPinModal);
    //window.location.href = "/userSettings";
  };

  //wenn auf Benutzer geklickt wird
  const openUser = (id,index) => {
    if(checkPinNeeded(id)){
        console.log("PIN needed!");
        //document.getElementsByClassName("UserPinRequestModal-"+index).onOpen();
        console.log(pinModals[index].current);
        
    }else{
        console.log("OPEN User without PIN");
        switchToUserMainPage(id);
    }
  };

  return (
    <Wrap 
      w='auto'
      
      mt={'100px'}
      maxWidth={{base: '220px', md: '445px', xl: '895px'}}
      spacing='5px' 
      >
        
      
        {users &&

          <React.Fragment>
          {Object.keys(users).map((key, index) => (
            <WrapItem w='220px' h='192px' key={index} alignItems='top'>
              <Center w='220px' h='192px' color='white' bg='transparent' alignItems='top'>
                <Box variant='ghost' as='button' color='black' role='group' onClick={() => openUser(users[key].id, index)}>
                  <Center>
                    <Avatar
                      border='4px'
                      borderEndColor='Teal'
                      borderStartColor='Teal'
                      borderTopColor='Teal'
                      borderBottomColor='Teal'
                      size='2xl'
                      name={users[key].name}
                      src={userImageFolder + users[key].profileImagePath}
                      _groupHover={{ border: '8px', borderColor: 'teal.300' }}
                    />
                  </Center>
                  <Center>
                    <Text
                      fontSize='lg'
                      fontWeight='bold'
                      color='black'
                      mt={2}
                      maxWidth='250px'
                    >
                      {users[key].name}
                    </Text>
                  </Center>
                </Box>
              </Center>
              <UserPinRequestModal ref={pinModals[index]} executeIfValid={() => window.location.href = "/devices"} users={users}/>
            </WrapItem>
            
          ))}
          <WrapItem w='220px' h='192px' alignItems='top'>
              <Center w='220px' h='192px' color='white' bg='transparent' alignItems='top'>
                <Box variant='ghost' as='button' color='black' role='group' onClick={() => openUserSettings()}>
                  <Center>
                    <Avatar
                      border='4px'
                      borderEndColor='Teal'
                      borderStartColor='Teal'
                      borderTopColor='Teal'
                      borderBottomColor='Teal'
                      size='2xl'
                      src={userImageFolder + 'user_settings.png'}
                      _groupHover={{ border: '8px', borderColor: 'teal.300' }}
                    />
                  </Center>
                  <Center>
                    <Text
                      fontSize='lg'
                      fontWeight='bold'
                      color='black'
                      mt={2}
                      maxWidth='250px'
                    >
                      Benutzerverwaltung
                    </Text>
                  </Center>
                </Box>
              </Center>
              <UserPinRequestModal ref={userAdministrationPinModal} executeIfValid={() => window.location.href = "/userAdministration"} users={users} />
            </WrapItem>
          </React.Fragment>
        }
        {!users && 
          <WrapItem w='220px' h='192px'>
            <Center w='220px' h='192px'  color='white' bg='transparent' alignItems='top' display='block'>
              
                <Avatar 
                  border='4px' 
                  borderEndColor='Teal' 
                  borderStartColor='Teal' 
                  borderTopColor='Teal'
                  borderBottomColor='Teal'
                  size='2xl' 
                  icon = {<Spinner size='xl' color='Teal' />}
                />
              <Box>
              <Center>
                  <Text fontSize='lg' fontWeight='bold' color='black' mt={2} whiteSpace="pre-line">Lade Benutzer</Text>
              </Center>
              </Box>
            </Center>
            
          </WrapItem>
        }
    </Wrap>
  );
}





class ChooseUser extends Component {
  isTest = true;
  render() { 
    
    return (
      <Center>
        <Users isTest={this.isTest} ></Users>
      </Center>
      );
  };  
}     

export default ChooseUser;
