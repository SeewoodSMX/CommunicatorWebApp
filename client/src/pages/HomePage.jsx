import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Grid } from '@mui/material';
import ContactsDrawer from '../components/homePage/contactsDrawer/ContactsDrawer';
import ChatPanel from '../components/homePage/ChatPanel';
import AppBarMod from '../components/homePage/appBarMod/AppBarMod';
import { ChangePassword } from '../components/homePage/appBarMod/ChangePassword';
import {
    initiateSocketConnection,
    disconnectSocket,
    sendMessage,
    responseMessage,
    deleteMessage,
    onDeleteMessage,
    addNewContact,
    onAddNewContact,
    deleteOneContact,
    onDeleteOneContact,
    onActiveUser,
} from '../services/socket.service';

import { genInitVector, encrypt, decrypt } from '../services/e2e.service';

export function HomePage() {
    //auth i dane usera
    const context = useAuth();
    const curUser = context.user;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userSelected, setUserSelected] = useState({});
    const [chat, setChat] = useState([]);
    const [usersArray, setUsersArray] = useState([]);
    const [viewModel, setViewModel] = useState(null);
    const [queryResult, setQueryResult] = useState(null);
    //const [isConnected, setIsConnected] = useState(false);
    const [openRemindPassword, setOpenRemindPassword] = useState(false);
    const [resetPasswordValue, setResetPasswordValue] = useState('');
    const lastMessageRef = useRef(null);
    //pobranie kontaktów usera
    const getContacts = () => {
        context
            .getAllContacts()
            .then((response) => {
                setUsersArray(response.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        getContacts();
        if (curUser) {
            initiateSocketConnection(curUser.accessToken);
        }
        return () => {
            disconnectSocket();
        };
    }, [curUser]);
    useEffect(() => {
        onAddNewContact(usersArray, setUsersArray);
        onDeleteOneContact(usersArray, setUsersArray);
        onActiveUser(usersArray, setUsersArray);
    }, [usersArray]);
    //onResponse
    useEffect(() => {
        if (curUser) {
            responseMessage(chat, setChat, userSelected.id, curUser.id);
            lastMessageRef.current?.scrollIntoView();
        }
    }, [chat, userSelected]);

    useEffect(() => {
        onDeleteMessage(chat, setChat);
    }, [chat]);
    //przełączenie drawera na mobilke
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    //wybór usera do chatu (click na drawer)
    const handleUser = (user) => {
        getChat(user);
    };
    //req do serwera - podaj chat w którym biorą udział id: user.id && curUser.id
    const getChat = (user) => {
        context
            .getChat(user.id)
            .then((response) => {
                if (response.data.message !== 'noHeader') {
                    const data = response.data.map((el) => {
                        return {
                            ...el,
                            message: decrypt(el.initVector, el.message),
                            sendDate: new Date(el.sendDate).toLocaleString(),
                        };
                    });
                    setUserSelected(user);
                    setChat(data);
                    setViewModel('chat');
                } else {
                    setUserSelected(user);
                    setChat([]);
                    setViewModel('chat');
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    //wyszukiwanie użytkowników, aby dodać jako kontakt
    const handleSearchInput = (query) => {
        if (query.length > 0 && query.length < 3) {
            setViewModel('search');
        } else if (query.length >= 3) {
            context
                .getUsersByQuery(query)
                .then((response) => {
                    console.log(response.data);
                    setQueryResult(response.data);
                    setViewModel('result');
                })
                .catch((err) => {
                    console.log(err);
                });
        } else if (query.length === 0) {
            setViewModel(null);
        }
    };
    //dodawanie kontaktu
    const addContact = (newContact) => {
        console.log(newContact);
        addNewContact({
            newContactID: newContact.id,
        });
    };
    //usuwanie kontaktu
    const deleteContact = (contactToDelete) => {
        console.log(contactToDelete);
        deleteOneContact({
            contactToDeleteID: contactToDelete.id,
        });
    };
    //wysyłanie wiadomości
    const sendMsg = (textFieldValue) => {
        const initVector = genInitVector();
        const encryptedMessage = encrypt(initVector, textFieldValue);
        sendMessage({
            receiverUserID: userSelected.id,
            message: encryptedMessage.toString(),
            initVector: initVector,
        });
    };
    //usuwanie wiadomości
    const deleteMsg = (id) => {
        deleteMessage({ id: id, receiverUserID: userSelected.id });
    };
    const handleMyAccount = () => {
        console.log('moje konto');
        setOpenRemindPassword(true);
    };
    const resetPassword = () => {
        context.resetPassword(resetPasswordValue).then((response) => {
            if (response.status === 200) {
                disconnectSocket();
                context.logout();
            } else {
                console.log('password reset error');
            }
        });
    };
    const handleLogOut = () => {
        context.logout();
    };
    return (
        <>
            {!!context.user && (
                <Grid container direction='column' height='100%'>
                    <AppBarMod
                        handleDrawerToggle={handleDrawerToggle}
                        curUser={curUser}
                        handleSearchInput={handleSearchInput}
                        handleMyAccount={handleMyAccount}
                        handleLogOut={handleLogOut}
                    ></AppBarMod>
                    <Grid container item sx={{ flexGrow: 1 }}>
                        <Grid container item>
                            <Grid item xs={'auto'}>
                                <ContactsDrawer
                                    handleDrawerToggle={handleDrawerToggle}
                                    mobileOpen={mobileOpen}
                                    handleUser={handleUser}
                                    usersArray={usersArray}
                                ></ContactsDrawer>
                            </Grid>
                            <Grid container item xs height='100%'>
                                <ChatPanel
                                    user={userSelected}
                                    chat={chat}
                                    curUser={curUser}
                                    sendMsg={sendMsg}
                                    queryResult={queryResult}
                                    addContact={addContact}
                                    deleteContact={deleteContact}
                                    setChat={setChat}
                                    lastMessageRef={lastMessageRef}
                                    deleteMsg={deleteMsg}
                                    viewModel={viewModel}
                                    setViewModel={setViewModel}
                                    usersArray={usersArray}
                                ></ChatPanel>
                                <ChangePassword
                                    open={openRemindPassword}
                                    setOpen={setOpenRemindPassword}
                                    resetPassword={resetPassword}
                                    resetPasswordValue={resetPasswordValue}
                                    setResetPasswordValue={
                                        setResetPasswordValue
                                    }
                                ></ChangePassword>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            )}
        </>
    );
}
