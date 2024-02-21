import React, { Component } from 'react';
import { Text, Grid, GridItem, Center, Show} from "@chakra-ui/react";
import {Avatar} from "@chakra-ui/avatar";
import { Link } from 'react-router-dom';
import { encryptString, decryptString } from '../../encryptionUtils';



class ChooseUser extends Component {
  state = {  } 
  user = {
    user1: {
      profileImagePath: "assets/img/user_profile_images/user_profile_1.jpg",
      name: "Paul56789012",
      id: 1
    },
    user2: {
      profileImagePath: "assets/img/user_profile_images/user_profile_2.jpg",
      name: "WWWWWWWWWWWW",
      id: 2
    },
    user3: {
      profileImagePath: "assets/img/user_profile_images/user_profile_3.jpg",
      name: "Deine Mutter",
      id: 3
    },
    user4: {
      profileImagePath: "assets/img/user_profile_images/user_profile_4.jpg",
      name: "Hans",
      id: 4
    },
    user5: {
      profileImagePath: "assets/img/user_profile_images/user_profile_5.jpg",
      name: "Peter",
      id: 5
    },
    user6: {
      profileImagePath: "assets/img/user_profile_images/user_profile_6.jpg",
      name: "Klaus",
      id: 6
    },
    user7: {
      profileImagePath: "assets/img/user_profile_images/user_profile_7.jpg",
      name: "Karl",
      id: 7
    }
  };
  render() { 
    
    return (
      <Center>
        <Grid 
          templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)'}} 
          rowGap={196}
          columnGap={2}
          mt={150}
          maxWidth={'1000px'}
          >

          {Object.keys(this.user).map((key, index) => {
            return (
              <GridItem w='100%' h='0'  key={index} >
                <Center w='250px' h='192px'  color='white' bg='transparent' alignItems='top' >
                  <Link to="/devices" color='black' role='group' onClick={console.log("test")}>
                    <Center>
                      <Avatar 
                        border='4px' 
                        borderEndColor='Teal' 
                        borderStartColor='Teal' 
                        borderTopColor='Teal'
                        borderBottomColor='Teal'
                        size='2xl' 
                        name={ this.user[key].name } 
                        src={this.user[key].profileImagePath} 
                        _groupHover={{border:'8px', borderColor: 'teal.300' }}
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
                        {this.user[key].name}
                      </Text>
                    </Center>
                  </Link>
                </Center>
              </GridItem> 
            );
          }
          )}
          <GridItem w='100%' h='0'>
            <Center w='200' h='190px'  color='white' bg='transparent'>
              <Link to="/userAdministration" color='black' pt='0' role='group'>
                <Avatar 
                  
                  border='4px' 
                  borderEndColor='Teal' 
                  borderStartColor='Teal' 
                  borderTopColor='Teal'
                  borderBottomColor='Teal'
                  size='2xl' 
                  name='user_settings'
                  src='assets/img/user_profile_images/user_settings.png'
                  _groupHover={{border:'8px', borderColor: 'teal.300' }}
                />
                <Center>
                  <Text fontSize='lg' fontWeight='bold' color='black' mt={2} whiteSpace="pre-line">Benutzer</Text>
                </Center>
                <Center>
                  <Text fontSize='lg' fontWeight='bold' color='black'  whiteSpace="pre-line">Verwaltung</Text>
                </Center>
                
              </Link>
            </Center>
          </GridItem>
        </Grid>
      </Center>
      );
  };  
}     

export default ChooseUser;
