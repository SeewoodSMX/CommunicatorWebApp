import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useAuth } from '../hooks/useAuth';
// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
// import DialogTitle from '@mui/material/DialogTitle';

export const LoginPage = () => {
    const { login, register } = useAuth();
    const [isLogin, setisLogin] = React.useState(true);
    const [errorMsg, setErrorMsg] = React.useState(null);
    const [errorUinUseMsg, setErrorUinUseMsg] = React.useState(null);
    const [errorEinUseMsg, setErrorEinUseMsg] = React.useState(null);
    const [usernameVal, setUsernameVal] = React.useState('');
    const [firstNameVal, setFirstNameVal] = React.useState('');
    const [lastNameVal, setLastNameVal] = React.useState('');
    const [emailVal, setEmailVal] = React.useState('');
    const [passwordVal, setPasswordVal] = React.useState('');
    const handleSubmit = (event) => {
        event.preventDefault();
        if (isLogin) {
            login({
                email: emailVal,
                password: passwordVal,
            }).catch((err) => {
                setErrorMsg('Błędny login lub hasło!');
                console.log(err);
            });
        } else {
            register({
                username: usernameVal,
                firstName: firstNameVal,
                lastName: lastNameVal,
                email: emailVal,
                password: passwordVal,
            })
                .then((response) => {
                    if (response) {
                        console.log(response);
                        event.target.reset();
                        setisLogin(!isLogin);
                    }
                })
                .catch((err) => {
                    let error = err.response.data.message;
                    console.log(error);
                    if (error === 'unInUse') {
                        setErrorEinUseMsg(null);
                        setErrorUinUseMsg('Nazwa użytkownika już w użyciu!');
                    } else if (error === 'eInUse') {
                        setErrorUinUseMsg(null);
                        setErrorEinUseMsg('Adres email już w użyciu!');
                    } else {
                        setErrorUinUseMsg(null);
                        setErrorEinUseMsg(null);
                        setErrorMsg('Nieznany błąd!');
                    }
                });
        }
    };
    //Przypomnienie hasło
    // const [open, setOpen] = React.useState(false);
    // const handleClose = () => {
    //     setOpen(false);
    // };
    //DODAĆ FUNKCJE PRZYPOMNIJ HASŁO?
    return (
        <Container component='main' maxWidth='xs'>
            <Box
                sx={{
                    pt: 6,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component='h1' variant='h5' pb={1}>
                        {isLogin ? 'Logowanie' : 'Rejestracja'}
                    </Typography>
                    <Typography component='p' variant='subtitle1' color='red'>
                        {!!errorMsg ? (
                            errorMsg
                        ) : !!errorUinUseMsg ? (
                            errorUinUseMsg
                        ) : !!errorEinUseMsg ? (
                            errorEinUseMsg
                        ) : (
                            <span>&nbsp;&nbsp;</span>
                        )}
                    </Typography>
                </Box>

                <Box component='form' onSubmit={handleSubmit} id='mainForm'>
                    {!isLogin && (
                        <>
                            <TextField
                                margin='normal'
                                required
                                fullWidth
                                error={!!errorUinUseMsg}
                                label='Nazwa Użytkownika'
                                name='username'
                                id='username'
                                autoComplete='current-username'
                                value={usernameVal}
                                onChange={(e) => {
                                    setUsernameVal(e.target.value);
                                }}
                                color='label'
                            />
                            <TextField
                                margin='normal'
                                required
                                fullWidth
                                name='firstName'
                                label='Imię'
                                id='firstName'
                                autoComplete='current-firstName'
                                value={firstNameVal}
                                onChange={(e) => {
                                    setFirstNameVal(e.target.value);
                                }}
                                color='label'
                            />
                            <TextField
                                margin='normal'
                                required
                                fullWidth
                                name='lastName'
                                label='Nazwisko'
                                id='lastName'
                                autoComplete='current-lastName'
                                value={lastNameVal}
                                onChange={(e) => {
                                    setLastNameVal(e.target.value);
                                }}
                                color='label'
                            />
                        </>
                    )}
                    <TextField
                        margin='normal'
                        required
                        fullWidth
                        error={!!errorMsg || !!errorEinUseMsg}
                        name='email'
                        type='email'
                        id='email'
                        label='E-mail'
                        autoComplete='email'
                        value={emailVal}
                        onChange={(e) => {
                            setEmailVal(e.target.value);
                        }}
                        color='label'
                    />
                    <TextField
                        margin='normal'
                        required
                        fullWidth
                        error={!!errorMsg && isLogin}
                        name='password'
                        label='Hasło'
                        type='password'
                        id='password'
                        autoComplete='current-password'
                        value={passwordVal}
                        onChange={(e) => {
                            setPasswordVal(e.target.value);
                        }}
                        color='label'
                    />
                    <Button
                        type='submit'
                        fullWidth
                        variant='contained'
                        sx={{ mt: 3, mb: 2 }}
                    >
                        {isLogin ? 'Logowanie' : 'Rejestracja'}
                    </Button>
                    {/* {isLogin && (
                        <Button
                            type='submit'
                            fullWidth
                            variant='contained'
                            sx={{ mb: 2 }}
                            onClick={() => {
                                setOpen(true);
                            }}
                        >
                            Przypomnij hasło
                        </Button>
                    )}
                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>Reset Hasła</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Podaj e-mail do przypomnienia hasła
                            </DialogContentText>
                            <TextField
                                autoFocus
                                margin='dense'
                                error={!!errorMsg || !!errorEinUseMsg}
                                name='rstemail'
                                type='email'
                                id='rstemail'
                                label='E-mail'
                                autoComplete='email'
                                fullWidth
                                variant='standard'
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Anuluj</Button>
                            <Button onClick={handleClose}>Wyślij</Button>
                        </DialogActions>
                    </Dialog> */}

                    <Button
                        fullWidth
                        variant='contained'
                        onClick={() => {
                            setisLogin(!isLogin);
                            setErrorMsg(null);
                            setErrorUinUseMsg(null);
                            setErrorEinUseMsg(null);
                            setUsernameVal('');
                            setFirstNameVal('');
                            setLastNameVal('');
                            setEmailVal('');
                            setPasswordVal('');
                        }}
                    >
                        {isLogin
                            ? 'Nie masz konta? Zarejestruj się tu'
                            : 'Masz już konto? Zaloguj się tutaj'}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};
