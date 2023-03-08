import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useAuth } from '../../hooks/useAuth';
export default function MenuAccount(props) {
    const { logout } = useAuth();
    const { curUser, handleMyAccount } = props;
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleLogOut = () => {
        console.log('logout');
        logout();
    };
    const logOutWrapper = () => {
        handleClose();
        handleLogOut();
    };

    return (
        <div>
            <IconButton
                onClick={handleMenu}
                size='large'
                aria-label='account of current user'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                color='inherit'
            >
                <Avatar
                    sx={{
                        width: 32,
                        height: 32,
                        bgcolor: 'primary.textLight',
                        color: 'primary.main',
                        fontSize: '1rem',
                    }}
                >
                    {!!curUser && curUser.firstName[0] + curUser.lastName[0]}
                </Avatar>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                id='account-menu'
                open={Boolean(anchorEl)}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 0.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 22,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{
                    horizontal: 'right',
                    vertical: 'top',
                }}
                anchorOrigin={{
                    horizontal: 'right',
                    vertical: 'bottom',
                }}
            >
                <MenuItem>
                    {curUser.firstName + ' ' + curUser.lastName}
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        handleMyAccount();
                        handleClose();
                    }}
                >
                    Zmień hasło
                </MenuItem>
                <MenuItem onClick={logOutWrapper}>Wyloguj</MenuItem>
            </Menu>
        </div>
    );
}
