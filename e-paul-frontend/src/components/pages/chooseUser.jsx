import React, { Component,useState, useEffect } from 'react';
import {Box, Text, Center, Spinner,Wrap,WrapItem} from '@chakra-ui/react';
import {Avatar} from '@chakra-ui/avatar';
import { encryptString, decryptString } from '../../encryptionUtils';
import UserPinRequestModal from '../userPinRequestModal';

//local test presets (dont needed at server)
sessionStorage.setItem('accountID', encryptString('1'));

//Test Array für Benutzer
const user = [
  {
    profileImagePath: "user_profile_1.jpg",
    name: "Paul56789012",
    id: 1
  },
  {
    profileImagePath: "user_profile_2.jpg",
    name: "WWWWWWWWWWWW",
    id: 2
  },
  {
    profileImagePath: "user_profile_3.jpg",
    name: "XXXXXXXXXXXX",
    id: 3
  },
  {
    profileImagePath: "user_profile_4.jpg",
    name: "YYYYYYYYYYYY",
    id: 4
  },
  {
    profileImagePath: "user_profile_5.jpg",
    name: "ZZZZZZZZZZZZ",
    id: 5
  },
  {
    profileImagePath: "user_profile_6.jpg",
    name: "AAAAAAAAAAAA",
    id: 6
  },
  {
    profileImagePath: "user_profile_7.jpg",
    name: "BBBBBBBBBBBB",
    id: 7
  }
];



function Users() {
  const userImageFolder = "assets/img/user_profile_images/";

  //Benutzerliste
  const [users, setUsers] = useState(user);

  //Referenzen auf die Pin-Modals Array
  const [pinModals, setPinModals] = useState([false,false,false,false,false,false,false]);
  const [userAdministrationPinModal, setUserAdministrationPinModal] = useState(false);
  let accountID = decryptString(('accountID').toString());

  //Wird beim Laden der Komponente ausgeführt
  useEffect(() => {
    sessionStorage.setItem('userAuthorized', encryptString("false"));
    //fetch users from backend
    //setUsers(users);
  }, []);

  //Managed das Array für die Pin-Modals (öffnen)
  function openPinModal(index) {
    const nextPinModals = pinModals.map((c, i) => {
      if (i === index) {
        return true;
      } else {
        return c;
      }
    });
    setPinModals(nextPinModals);
  }

  //Managed das Array für die Pin-Modals (schließen)
  function closePinModal(index) {
    const nextPinModals = pinModals.map((c, i) => {
      if (i === index) {
        return false;
      } else {
        return c;
      }
    });
    setPinModals(nextPinModals);
  }


  //prüft ob ein Pin benötigt wird
  const checkPinNeeded = (id) => {
    //fetch user from backend
    //if user needs pin, return true
    //else return false
    return false;
  };

  //wenn auf Benutzereinstellungen geklickt wird
  const openUserSettings = () => {
    sessionStorage.setItem("executingUserID", "");
    setUserAdministrationPinModal(true);
  };

  //wenn auf Benutzer geklickt wird
  const openUser = (id,index) => {
    const encryptedId = encryptString(id.toString());
    sessionStorage.setItem("executingUserID", encryptedId);
    if(checkPinNeeded(id)){
        console.log("PIN needed!");
        openPinModal(index);
    }else{
        console.log("OPEN User without PIN");
        sessionStorage.setItem('userAuthorized', encryptString("true"));
        window.location.href = "/devices";
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
              <UserPinRequestModal executeIfValid={() => window.location.href='/devices'} users={users} openModal={pinModals[index]} closeModal={() => closePinModal(index)}/>
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
             <UserPinRequestModal openModal={userAdministrationPinModal} closeModal={() => setUserAdministrationPinModal(false)} executeIfValid={() => window.location.href='/userAdministration'} users={users}/>
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
                  <Text fontSize='lg' fontWeight='bold' color='black' mt={2} whiteSpace='pre-line'>Lade Benutzer</Text>
              </Center>
              </Box>
            </Center>
            
          </WrapItem>
        }
    </Wrap>
  );
}


class ChooseUser extends Component {
  render() { 
    
    return (
      <Center>
        <Users  ></Users>
      </Center>
      );
  };  
}     

export default ChooseUser;
