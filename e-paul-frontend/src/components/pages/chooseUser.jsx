import React, { Component } from 'react';
import './chooseUser.css';
import '../../styles/style.css';
import {Avatar} from "@chakra-ui/avatar";
import { Link } from 'react-router-dom';



class ChooseUser extends Component {
  state = {  } 
  render() { 

//Verbindung mit Datenbank
var data = [
    { name: "User1", picture: "assets/img/user1.jpg", nextPage: "https://www.pictureofhotdog.com"},
    { name: "User2", picture: "assets/img/user2.jpg", nextPage: "https://www.pictureofhotdog.com"},
    { name: "User3", picture: "assets/img/user2.jpg", nextPage: "https://www.pictureofhotdog.com"},
    { name: "User4", picture: "assets/img/user1.jpg", nextPage: "https://www.pictureofhotdog.com"},
    { name: "User5", picture: "assets/img/user2.jpg", nextPage: "https://www.pictureofhotdog.com"},
    { name: "User6", picture: "assets/img/user1.jpg", nextPage: "https://www.pictureofhotdog.com"},
    { name: "Einstellungen", picture: "assets/img/einstellungen.jpg", nextPage: "/options"}
]

const firstTable = data.slice(0, 4);
const secondTable = data.slice(4, 8);


return (
    <div>
    <h1>Benutzerkonto auswählen</h1>
    <div class="row">
    <div class="column">
      <table>
        <tbody>

          {firstTable.map(data => (
          <>
            <tr key={data.id}>
              <td>{data.name}</td>
            </tr>
            <tr key={data.id}>
              <td><a href={data.nextPage} target="_blank" rel="noopener noreferrer"><Avatar alt='Profilbild' src={data.picture}/></a></td>
            </tr>
          </>
          )
          )}
        </tbody>   
      </table>
      </div>
      <div class="column">
      <table>
        <tbody>
          {secondTable.map(data => (
            <>
            <tr key={data.id}>
              <td>{data.name}</td>
            </tr>
            <tr key={data.id}>
              <td><Link to={data.nextPage}><Avatar alt='Profilbild' src={data.picture}/></Link></td>
            </tr>
          </>
          )
          )}
        </tbody> 
      </table>
    </div>
    </div>
    </div>
  );
};  
}     

export default ChooseUser;
