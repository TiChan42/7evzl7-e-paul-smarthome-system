import React from "react";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';

//components
import About from "./components/about";
import Login from "./components/login";
import SignIn from "./components/signIn";
import RootLayout from "./Layouts/RootLayout"
import Welcome from "./components/welcome"
import ChooseUser from "./components/chooseUser"
import Devices from "./components/devices"

//router
const router = createBrowserRouter (
    createRoutesFromElements (
        <Route exact path="/" element={<RootLayout/>}>
            <Route index element={<Welcome/>}/>
            <Route path="/about" element={<About/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/signin" element={<SignIn/>}/>
            <Route path="/chooseuser" element={<ChooseUser/>}/>
            <Route path="/devices" element={<Devices/>}/>
        </Route>
    )
)

function App() {
    return (
        <RouterProvider router={router}/>
    )
}

export default App;
