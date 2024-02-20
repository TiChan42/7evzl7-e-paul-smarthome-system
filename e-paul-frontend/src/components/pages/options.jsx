import React, { Component } from 'react';
import { Grid, GridItem } from '@chakra-ui/react';
import { CloseButton } from '@chakra-ui/react';
import { Link } from 'react-router-dom';


  //YOOO benutz später toast für benachrichtigungen
  class Options extends Component {
    state = {  } 
    render() { 

return (

  <Grid
  templateAreas={`"header header"
                  "main main"`}
  gridTemplateRows={'50px 1fr 30px'}
  gridTemplateColumns={'150px 1fr'}
  h=''
  gap='1'
  color='blackAlpha.700'
  fontWeight='bold'
>  {/* Header*/}
  <GridItem pl='2' area={'header'}>
    <h1>Benutzer Einstellungen</h1> 
    <Link to="/chooseuser"><CloseButton /></Link>
   
  </GridItem>

   {/* Main*/}
  <GridItem pl='2' bg='green.300' area={'main'}>
    Main
  </GridItem>
</Grid>

      );
    };
  }
export default Options;
