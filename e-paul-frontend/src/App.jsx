import React from "react";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';

//components
import About from "./components/about";
import Login from "./components/login";
import SignIn from "./components/signIn";
import RootLayout from "./Layouts/RootLayout"
import Welcome from "./components/welcome"
import ChooseUser from "./components/chooseUser"
import Impressum from "./components/impressum"
import Devices from "./components/devices"
import Options from "./components/options"
import FAQ from "./components/faq";

import theme from "./theme";
import { ChakraProvider } from "@chakra-ui/react";

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
            <Route path="/faq" element={<ChakraProvider theme={theme}><FAQ/></ChakraProvider>}/>
        </Route>
    )
)

function App() {
    return (
        <RouterProvider router={router}/>
    )
}

export default App;
