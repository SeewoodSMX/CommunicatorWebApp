import * as React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Grid } from '@mui/material';
import ContactsDrawer from '../components/homePage/ContactsDrawer';
import ChatPanel from '../components/homePage/ChatPanel';
import AppBarMod from '../components/homePage/AppBarMod';
import { ChangePassword } from '../components/homePage/ChangePassword';
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
    //
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [userSelected, setUserSelected] = React.useState(null);
    const [chat, setChat] = React.useState([]);
    const [usersArray, setUsersArray] = React.useState([]);
    const [viewModel, setViewModel] = React.useState(null);
    const [queryResult, setQueryResult] = React.useState(null);
    //const [isConnected, setIsConnected] = React.useState(false);
    const [openRemindPassword, setOpenRemindPassword] = React.useState(false);
    const [resetPasswordValue, setResetPasswordValue] = React.useState('');
    const lastMessageRef = React.useRef(null);
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

    React.useEffect(() => {
        getContacts();
        if (curUser) {
            initiateSocketConnection(curUser.accessToken);
        }
        return () => {
            console.log('socket disconnected');
            disconnectSocket();
        };
    }, [curUser]);
    React.useEffect(() => {
        onAddNewContact(usersArray, setUsersArray);
        onDeleteOneContact(usersArray, setUsersArray);
        onActiveUser(usersArray, setUsersArray);
    }, [usersArray]);
    React.useEffect(() => {
        responseMessage(chat, setChat);
        lastMessageRef.current?.scrollIntoView();
    }, [chat]);
    React.useEffect(() => {
        onDeleteMessage(chat, setChat);
    }, [chat]);
    //przełączenie drawera na mobilke
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    //wybór usera do chatu (click na drawer)
    const handleUser = (user) => {
        setUserSelected(user);
        getChat(user);
    };
    //req do serwera - podaj chat w którym biorą udział id: user.id && curUser.id
    const getChat = (user) => {
        // console.log(user);
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

                    setChat(data);
                    setViewModel('chat');
                } else {
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
        console.log(resetPasswordValue);
        context.resetPassword(resetPasswordValue).then((response) => {
            if (response.status === 200) {
                disconnectSocket();
                context.logout();
            } else {
                console.log('password reset error');
            }
        });
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
