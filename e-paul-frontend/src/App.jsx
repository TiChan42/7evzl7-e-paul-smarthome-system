import React from "react";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';

//components
import About from "./components/about";
import Login from "./components/login";
import SignIn from "./components/signIn";
import RootLayout from "./Layouts/RootLayout"
import Welcome from "./components/welcome"


//router
const router = createBrowserRouter (
    createRoutesFromElements (
        <Route exact path="/" element={<RootLayout/>}>
            <Route index element={<Welcome/>}/>
            <Route path="/about" element={<About/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/signin" element={<SignIn/>}/>
        </Route>
    )
)

function App() {
    return (
        <RouterProvider router={router}/>
    )
}

export default App;
