import React, { Component } from 'react';
import { Text, Grid, GridItem, Center, Show} from "@chakra-ui/react";
import {Avatar} from "@chakra-ui/avatar";
import { Link } from 'react-router-dom';
import { encryptString, decryptString } from '../../encryptionUtils';



class UserAdministration extends Component {
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
      <Text>Benutzerverwaltung</Text>
          
      );
  };  
}     

export default UserAdministration;
