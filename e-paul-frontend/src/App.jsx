import React from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';

//import pages
import About from '@/pages/about'
import RootLayout from '@/layout/RootLayout'
import Welcome from '@/pages/welcome'
import ChooseUser from '@/pages/chooseUser'
import Imprint from '@/pages/imprint'
import Devices from '@/pages/devices'
import UserAdministration from '@/pages/userAdministration'
import ModalTest from '@/pages/modalTest';
import Settings from "@/pages/settings"
import FAQ from "@/pages/faq";

//router
const router = createBrowserRouter (
    createRoutesFromElements (
        <Route exact path='/' element={<RootLayout/>}>
            <Route index element={<Welcome/>}/>
            <Route path="/about" element={<About/>}/>
            <Route path="/chooseUser" element={<ChooseUser/>}/>
            <Route path="/imprint" element={<Imprint/>}/>
            <Route path="/devices" element={<Devices/>}/>
            <Route path="/faq" element={<FAQ/>}/>
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
