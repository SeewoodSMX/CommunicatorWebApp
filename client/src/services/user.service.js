import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/users/';

const getPublicContent = () => {
    return axios.get(API_URL + 'all');
};

const getUserBoard = () => {
    return axios.get(API_URL + 'user', { headers: authHeader() });
};

const UserService = {
    getPublicContent,
    getUserBoard,
};

//TODO zastanowić się i dopisać co tutaj nam potrzeba

export default UserService;
