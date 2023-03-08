import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
} from 'react-router-dom';
import { LoginPage } from './pages/Login';
import { HomePage } from './pages/HomePage';
import { AuthLayout } from './components/AuthLayout';
import ErrorPage from './pages/ErrorPage';

export const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route element={<AuthLayout />} errorElement={<ErrorPage />}>
                <Route path='/' element={<LoginPage />} />
                <Route path='/homePage' element={<HomePage />} />
            </Route>
        </>
    )
);
