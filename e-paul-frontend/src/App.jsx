import React from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';

//components
import About from './components/pages/about'
import RootLayout from './Layouts/RootLayout'
import Welcome from './components/pages/welcome'
import ChooseUser from './components/pages/chooseUser'
import Imprint from './components/pages/imprint'
import Devices from './components/pages/devices'
import UserSettings from './components/pages/userSettings'
import UserAdministration from './components/pages/userAdministration'
import Options from './components/pages/options'
import FAQ from './components/pages/faq';
import theme from './theme';
import { ChakraProvider } from '@chakra-ui/react';
import ModalTest from './components/pages/modalTest';
import Settings from "./components/pages/settings"

import Options from "./components/pages/options"
import FAQ from "./components/pages/faq";

import theme from "./theme";
import { ChakraProvider } from "@chakra-ui/react";

//router
const router = createBrowserRouter (
    createRoutesFromElements (
        <Route exact path='/' element={<RootLayout/>}>
            <Route index element={<Welcome/>}/>
            <Route path="/about" element={<About/>}/>
            <Route path="/chooseUser" element={<ChooseUser/>}/>
            <Route path="/imprint" element={<Imprint/>}/>
            <Route path="/devices" element={<Devices/>}/>
            <Route path="/options" element={<Options/>}/>
            <Route path="/faq" element={<ChakraProvider theme={theme}><FAQ/></ChakraProvider>}/>
            <Route path="/userSettings" element={<UserSettings/>}/>
            <Route path="/settings" element={<Settings/>}/>
            <Route path='/userAdministration' element={<UserAdministration/>}/>
            <Route path='/modalTest' element={<ModalTest/>}/>
        </Route>
    )
)

function App() {
    return (
        <RouterProvider router={router}/>
    )
}

export default App;
