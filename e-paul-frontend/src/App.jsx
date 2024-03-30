
import React, { Suspense } from 'react';
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from 'react-router-dom';

//import pages
import RootLayout from './layout/RootLayout';
import About from './pages/about';
import Imprint from './pages/imprint';
import Welcome from './pages/welcome';

// lazy loading of pages not needed for initial load
const ChooseUser = React.lazy(() => import('./pages/chooseUser'));
const Devices = React.lazy(() => import('./pages/devices'));
const UserAdministration = React.lazy(() => import('./pages/userAdministration'));
const ModalTest = React.lazy(() => import('./pages/modalTest'));
const Settings = React.lazy(() => import('./pages/settings'));
const FAQ = React.lazy(() => import('./pages/faq'));


/**
 * Hauptkomponente der Anwendung.
 * @returns {JSX.Element} Die gerenderte App-Komponente.
 */
function App() {
    /**
     * Erstellt den Router und definiert die Routen der Anwendung.
     * @param {Object} props - Die Eigenschaften des Routers.
     * @returns {JSX.Element} Der gerenderte RouterProvider.
     */
    const createRouter = (props) => {
        const router = createBrowserRouter(
            createRoutesFromElements(
                <Route
                    exact
                    path='*'
                    element={<RootLayout />}
                >
                    <Route
                        index
                        element={<Welcome />}
                    />
                    <Route
                        path='about'
                        element={<About />}
                    />
                    <Route
                        path='chooseUser'
                        element={<ChooseUser />}
                    />
                    <Route
                        path='imprint'
                        element={<Imprint />}
                    />
                    <Route
                        path='devices'
                        element={<Devices />}
                    />
                    <Route
                        path='faq'
                        element={<FAQ />}
                    />
                    <Route
                        path='settings'
                        element={<Settings />}
                    />
                    <Route
                        path='userAdministration'
                        element={<UserAdministration />}
                    />
                    <Route
                        path='modalTest'
                        element={<ModalTest />}
                    />
                </Route>
            )
        );
        return <RouterProvider router={router} />;
    };

    return createRouter();
}

export default App;
