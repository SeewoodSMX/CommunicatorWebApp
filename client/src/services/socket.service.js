import io from 'socket.io-client';
import { decrypt } from '../services/e2e.service';
// const ENDPOINT = 'http://localhost:8080';
const ENDPOINT = `http://${window.location.hostname}:8080`;
let socket;
export const initiateSocketConnection = (token) => {
    socket = io(ENDPOINT, {
        auth: {
            token,
        },
    });
    console.log('Socket connected');
};
export const sendMessage = (data) => {
    if (socket) {
        socket.emit('sendMessage', data);
    }
};
export const responseMessage = (chat, setChat) => {
    if (socket) {
        socket.on('responseMessage', (data) => {
            data = {
                ...data,
                message: decrypt(data.initVector, data.message),
                sendDate: new Date(data.sendDate).toLocaleString(),
            };
            socket.off('responseMessage');
            if (chat) {
                setChat([...chat, data]);
            } else {
                setChat([data]);
            }
        });
    }
};
export const deleteMessage = (data) => {
    if (socket) {
        socket.emit('deleteMessage', data);
    }
};
export const onDeleteMessage = (chat, setChat) => {
    if (socket) {
        socket.on('onDeleteMessage', (id) => {
            let newChat = chat.filter((el) => el.id !== id);
            setChat(newChat);
            socket.off('onDeleteMessage');
        });
    }
};
export const addNewContact = (data) => {
    if (socket) {
        socket.emit('addContact', data);
    }
};
export const onAddNewContact = (usersArray, setUsersArray) => {
    if (socket) {
        socket.on('onAddNewContact', (data) => {
            console.log('contact');
            if (usersArray) {
                setUsersArray([...usersArray, data]);
            } else {
                setUsersArray([data]);
            }
            socket.off('onAddNewContact');
        });
    }
};
export const deleteOneContact = (data) => {
    if (socket) {
        socket.emit('deleteOneContact', data);
    }
};
export const onDeleteOneContact = (usersArray, setUsersArray) => {
    if (socket) {
        socket.on('onDeleteOneContact', (id) => {
            console.log(id);
            let newArray = usersArray.filter((el) => el.contact.id !== id);
            setUsersArray(newArray);
            socket.off('onDeleteOneContact');
        });
    }
};
export const onActiveUser = (usersArray, setUsersArray) => {
    if (socket) {
        socket.on('activeUser', (data) => {
            if (usersArray) {
                let newUsersArray = usersArray.map((user) => {
                    if (user.contact.id === data.userID) {
                        return {
                            ...user,
                            contact: {
                                ...user.contact,
                                isOnline: data.isOnline,
                            },
                        };
                    }
                    return user;
                });
                setUsersArray(newUsersArray);
            }
        });
    }
};
export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
    }
};
