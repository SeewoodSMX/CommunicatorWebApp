import * as React from 'react';
import {
    Paper,
    TextField,
    Grid,
    List,
    Fab,
    Divider,
    Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import Message from './Message';
import ContactExisting from './ContactExisting';
import ContactNotExisting from './ContactNotExisting';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    margin: '0.5rem',
}));

export default function ChatPanel(props) {
    const {
        user,
        chat,
        curUser,
        sendMsg,
        queryResult,
        addContact,
        deleteContact,
        lastMessageRef,
        deleteMsg,
        viewModel,
        usersArray,
    } = props;
    const msgInput = React.useRef('');
    const handleMsgSend = (val) => {
        if (val.trim().length > 0) {
            sendMsg(val);
            msgInput.current.value = '';
        }
    };
    const renderSwitch = (param) => {
        switch (param) {
            case 'chat':
                return (
                    <Grid
                        container
                        direction='column'
                        justifyContent='center'
                        m={2}
                    >
                        <Grid
                            container
                            direction='row'
                            textAlign='center'
                            bgcolor='#ededed'
                            margin='0.4rem'
                            borderRadius='10px'
                            padding='5px 0px'
                        >
                            <Grid item p={1.1} xs>
                                <Typography>
                                    {user.firstName + ' ' + user.lastName}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid item xs>
                            <List
                                style={{
                                    maxHeight: 'calc(100vh - 256px)',
                                    overflowY: 'auto',
                                }}
                            >
                                {chat ? (
                                    chat.map((msgObj, i) => (
                                        <Message
                                            msgData={{
                                                id: msgObj.id,
                                                userToChat: msgObj.senderUserID,
                                                curUser: curUser.id,
                                                msg: msgObj.message,
                                                sendDate: msgObj.sendDate,
                                            }}
                                            key={i}
                                            deleteMsg={deleteMsg}
                                        ></Message>
                                    ))
                                ) : (
                                    <Typography
                                        variant='p'
                                        component='p'
                                        textAlign='center'
                                    >
                                        Brak wiadomości
                                    </Typography>
                                )}
                                <div ref={lastMessageRef} />
                            </List>
                        </Grid>

                        <Grid container item>
                            <Grid item xs={12} mb={2}>
                                <Divider />
                            </Grid>
                            <Grid item xs={11}>
                                <TextField
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleMsgSend(
                                                msgInput.current.value
                                            );
                                        }
                                    }}
                                    inputRef={msgInput}
                                    id='msgInput'
                                    label='Napisz wiadomość'
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={1} align='right'>
                                <Fab
                                    color='primary'
                                    aria-label='send-message'
                                    onClick={() => {
                                        handleMsgSend(msgInput.current.value);
                                    }}
                                >
                                    <SendIcon />
                                </Fab>
                            </Grid>
                        </Grid>
                    </Grid>
                );
            case 'search':
                return (
                    <Grid container direction='column' textAlign='center' m={2}>
                        <Grid item>
                            <Item
                                sx={{
                                    bgcolor: 'secondary.main',
                                }}
                            >
                                <Typography>
                                    Wpisz przynajmniej 3 znaki w polu
                                    wyszukiwania, aby zobaczyć wyniki.
                                </Typography>
                            </Item>
                        </Grid>
                    </Grid>
                );
            case 'result':
                return (
                    <Grid container direction='column' textAlign='center' m={1}>
                        {queryResult.length === 0 ? (
                            <Item
                                sx={{
                                    bgcolor: 'secondary.main',
                                }}
                            >
                                <Typography>
                                    Brak wyników dla tego wyszukiwania!
                                </Typography>
                            </Item>
                        ) : (
                            queryResult
                                .filter((user) => user.id !== curUser.id)
                                .map((usr, i) => {
                                    return usersArray.some(
                                        (el) => el.contact.id === usr.id
                                    ) ? (
                                        <ContactExisting
                                            usr={usr}
                                            key={i}
                                            i={i}
                                            deleteContact={deleteContact}
                                        ></ContactExisting>
                                    ) : (
                                        <ContactNotExisting
                                            usr={usr}
                                            key={i}
                                            i={i}
                                            addContact={addContact}
                                        ></ContactNotExisting>
                                    );
                                })
                        )}
                    </Grid>
                );
            default:
                return (
                    <Grid container direction='column' textAlign='center' m={2}>
                        <Grid item>
                            <Item
                                sx={{
                                    bgcolor: 'secondary.main',
                                }}
                            >
                                <Typography>
                                    Wybierz konwersację po lewej lub dodaj nowy
                                    kontakt
                                </Typography>
                            </Item>
                        </Grid>
                    </Grid>
                );
        }
    };
    return renderSwitch(viewModel);
}
