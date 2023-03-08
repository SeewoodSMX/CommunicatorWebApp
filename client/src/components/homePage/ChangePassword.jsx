import * as React from 'react';
import { TextField, Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export function ChangePassword(props) {
    const {
        open,
        setOpen,
        resetPassword,
        resetPasswordValue,
        setResetPasswordValue,
    } = props;
    const handleClose = () => {
        setOpen(false);
    };
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle sx={{ paddingBottom: '8px' }}>Reset Hasła</DialogTitle>
            <DialogContent>
                <TextField
                    onChange={(newValue) =>
                        setResetPasswordValue(newValue.target.value)
                    }
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            if (resetPasswordValue.trim().length > 0) {
                                resetPassword(resetPasswordValue);
                                setResetPasswordValue('');
                                handleClose();
                            }
                        }
                    }}
                    autoFocus
                    name='rstpassword'
                    type='password'
                    id='rstemail'
                    label='Podaj nowe hasło'
                    fullWidth
                    variant='standard'
                    value={resetPasswordValue}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Anuluj</Button>
                <Button
                    onClick={() => {
                        if (resetPasswordValue.trim().length > 0) {
                            resetPassword();
                            setResetPasswordValue('');
                            handleClose();
                        }
                    }}
                >
                    Zatwierdź
                </Button>
            </DialogActions>
        </Dialog>
    );
}
