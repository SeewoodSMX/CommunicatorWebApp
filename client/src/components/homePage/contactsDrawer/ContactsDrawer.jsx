import * as React from 'react';
import { Box, Divider, Drawer, List, Toolbar, Typography } from '@mui/material';
import Contact from './Contact';

const drawerWidth = 240;
function ContactsDrawer(props) {
    const { window, handleDrawerToggle, mobileOpen, handleUser, usersArray } =
        props;
    const handleClick = (num) => handleUser(num);
    const drawer = (
        <Box>
            <Toolbar
                sx={{
                    bgcolor: 'primary.main',
                }}
            >
                <Box href='/homePage' component='a'>
                    <Box
                        component='img'
                        sx={{
                            height: 40,
                            width: 110,
                            ml: 2,
                            mt: 1,
                        }}
                        alt='Logo'
                        src='/icons/logoWebChat.png'
                    />
                </Box>
            </Toolbar>
            <Typography
                height='20px'
                variant='p'
                component='p'
                textAlign='center'
                fontSize='1rem'
                py='14px'
            >
                KONTAKTY
            </Typography>
            <Divider />
            <List>
                {usersArray.length > 0 ? (
                    usersArray.map((usr, i) => (
                        <Contact
                            key={i}
                            data={usr.contact}
                            handleClick={handleClick}
                        ></Contact>
                    ))
                ) : (
                    <Typography
                        variant='p'
                        component='p'
                        textAlign='center'
                        fontSize='0.9rem'
                        py='10px'
                    >
                        Brak kontaktów
                    </Typography>
                )}
            </List>
        </Box>
    );

    const container =
        window !== undefined ? () => window().document.body : undefined;

    return (
        <div>
            <Box
                component='nav'
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label='mailbox folders'
            >
                <Drawer
                    container={container}
                    variant='temporary'
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            bgcolor: 'secondary.main',
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant='permanent'
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            borderRight: 0,
                            bgcolor: 'secondary.main',
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
        </div>
    );
}

export default ContactsDrawer;
