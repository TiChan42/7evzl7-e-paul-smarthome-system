import React from "react";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';

//components
import About from "./pages/about";
import Login from "./pages/login";
import SignIn from "./pages/signIn";
import RootLayout from "./Layout/RootLayout"
import Welcome from "./pages/welcome"
import ChooseUser from "./pages/chooseUser"
import Impressum from "./pages/impressum"
import Devices from "./pages/devices"
import Options from "./pages/options"
import Darkmode from "./pages/darkmode"

//router
const router = createBrowserRouter (
    createRoutesFromElements (
        <Route exact path="/" element={<RootLayout/>}>
            <Route index element={<Welcome/>}/>
            <Route path="/about" element={<About/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/signin" element={<SignIn/>}/>
            <Route path="/chooseuser" element={<ChooseUser/>}/>
            <Route path="/impressum" element={<Impressum/>}/>
            <Route path="/devices" element={<Devices/>}/>
            <Route path="/options" element={<Options/>}/>
            <Route path="/darkmode" element={<Darkmode/>}/>
        </Route>
    )
)

function App() {
    return (
        <RouterProvider router={router}/>
        
    )
}

export default App;
