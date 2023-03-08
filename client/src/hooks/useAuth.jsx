import { createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStorage } from './useSessionStorage';
import axios from 'axios';

const AuthContext = createContext();

// const apiUrl = 'http://localhost:8080/api/';
const apiUrl = `http://${window.location.hostname}:8080/api/`;
let tempToken;
export const AuthProvider = ({ children, userData }) => {
    const [user, setUser] = useSessionStorage('user', userData);
    const navigate = useNavigate();
    const login = async (params) => {
        const { email, password } = params;
        return axios
            .post(apiUrl + 'auth/signin', {
                email,
                password,
            })
            .then((response) => {
                if (response.data.accessToken) {
                    setUser(response.data);
                    tempToken = response.data.accessToken;
                    navigate('/homePage', { replace: true });
                }
            });
    };
    const register = async (params) => {
        const { username, firstName, lastName, email, password } = params;
        return axios.post(apiUrl + 'auth/signup', {
            username,
            firstName,
            lastName,
            email,
            password,
        });
    };
    const authHeader = () => {
        if (user && user.accessToken) {
            return { 'x-access-token': user.accessToken };
        } else {
            return { 'x-access-token': tempToken };
        }
    };
    const getUsersByQuery = async (query) => {
        return axios.get(apiUrl + 'users/', {
            headers: authHeader(),
            params: { searchValue: query },
        });
    };
    const addNewContact = async (contactId) => {
        return axios.put(
            apiUrl + 'contacts/' + contactId,
            { adDesc: 'Contact created' },
            { headers: authHeader() }
        );
    };
    const resetPassword = async (password) => {
        return axios.put(
            apiUrl + 'users/',
            { password: password },
            { headers: authHeader() }
        );
    };
    const getAllContacts = async () => {
        return axios.get(apiUrl + 'contacts/', {
            headers: authHeader(),
        });
    };
    const getChat = async (id) => {
        return axios.post(
            apiUrl + 'chat/',
            { data: { id: id } },
            { headers: authHeader() }
        );
    };
    const logout = () => {
        setUser(null);
        navigate('/', { replace: true });
    };

    const isAutheticated = () => {
        if (user && user.accessToken) return true;
        return false;
    };

    const value = {
        user,
        login,
        register,
        logout,
        isAutheticated,
        getUsersByQuery,
        addNewContact,
        getAllContacts,
        getChat,
        resetPassword,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
