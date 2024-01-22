import React, {Component} from "react";
import Middle from "./components/middle";
import About from "./components/about";
import Header from "./components/header";
import Footer from "./components/footer";
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
                </Routes>
                <Footer/>
            </Router>

        );
    }
}
 
export default App;
