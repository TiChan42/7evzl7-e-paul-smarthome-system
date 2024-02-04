import React, { Component } from 'react';
import './chooseUser.css';
import {Avatar} from "@chakra-ui/avatar"

class ChooseUser extends Component {
  state = {  } 
  render() { 
//connection to database
var data = [
    { name: "User1", picture: "assets/img/user1.jpg"},
    { name: "User2", picture: "assets/img/user2.jpg"},
    { name: "User3", picture: "assets/img/user2.jpg"},
    { name: "User4", picture: "assets/img/user1.jpg"},
    { name: "User5", picture: "assets/img/user2.jpg"},
    { name: "User6", picture: "assets/img/user1.jpg"},
    { name: "Einstellungen", picture: "assets/img/einstellungen.jpg"}
]

const firstTable = data.slice(0, 4);
const secondTable = data.slice(4, 8);


return (
    <div>
    <h1>Benutzerkonto auswählen</h1>
      <table>
        <tbody>

          {firstTable.map((data) => (
          <>
            <tr key={data.id}>
              <td>{data.name}</td>
            </tr>
            <tr key={data.id}>
              <td><Avatar alt='Profilbild' src={data.picture}/></td>
            </tr>
          </>
          )
          )}
        </tbody>   
      </table>

      <table>
        <tbody>
          {secondTable.map((data) => (
            <>
            <tr key={data.id}>
              <td>{data.name}</td>
            </tr>
            <tr key={data.id}>
              <td><Avatar alt='Profilbild' src={data.picture}/></td>
            </tr>
          </>
          )
          )}
        </tbody> 
      </table>
    </div>
  );
};  
}     

export default ChooseUser;