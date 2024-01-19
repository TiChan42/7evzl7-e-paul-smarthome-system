import React, {Component} from "react";
import Middle from "./components/middle";
import Header from "./components/header";
import Footer from "./components/footer";

class App extends Component {
    state = {  } 
    render() { 
        return (
            <React.Fragment>
                <Header/>
                <Middle/>
                <Footer/>
            </React.Fragment>
            
        );
    }
}
 
export default App;
