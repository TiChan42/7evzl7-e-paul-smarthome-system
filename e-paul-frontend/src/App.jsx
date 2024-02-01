import React, {Component} from "react";
import Middle from "./components/middle";
import About from "./components/about";
import Header from "./components/header";
import Footer from "./components/footer";
import Login from "./components/login";
import SignIn from "./components/signIn";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

class App extends Component {
    state = {  } 
    render() { 
        return (
            <Router>
                <Header/>
                <Routes>
                    <Route exact path="/" element={<Middle/>}/>
                    <Route path="/about" element={<About/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/signin" element={<SignIn/>}/>
                </Routes>
                <Footer/>
            </Router>

        );
    }
}
 
export default App;
