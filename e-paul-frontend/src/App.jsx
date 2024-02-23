import React from "react";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';

//components
import About from "./components/pages/about"
import Login from "./components/pages/login"
import Register from "./components/pages/register"
import RootLayout from "./Layouts/RootLayout"
import Welcome from "./components/welcome"
import ChooseUser from "./components/chooseUser"
import Impressum from "./components/impressum"
import Imprint from "./components/pages/imprint"
import Devices from "./components/devices"
import Options from "./components/options"
import FAQ from "./components/faq"
import UserSettings from "./components/pages/userSettings"
import UserAdministration from "./components/pages/userAdministration"

import theme from "./theme";
import { ChakraProvider } from "@chakra-ui/react";

//router
const router = createBrowserRouter (
    createRoutesFromElements (
        <Route exact path="/" element={<RootLayout/>}>
            <Route index element={<Welcome/>}/>
            <Route path="/about" element={<About/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/chooseUser" element={<ChooseUser/>}/>
            <Route path="/imprint" element={<Imprint/>}/>
            <Route path="/devices" element={<Devices/>}/>
            <Route path="/options" element={<Options/>}/>
            <Route path="/faq" element={<ChakraProvider theme={theme}><FAQ/></ChakraProvider>}/>
            <Route path="/userSettings" element={<UserSettings/>}/>
            <Route path="/userAdministration" element={<UserAdministration/>}/>
        </Route>
    )
)

function App() {
    return (
        <RouterProvider router={router}/>
    )
}

export default App;
