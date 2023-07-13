import * as React from 'react';
import { AppBar, Grid, Toolbar, IconButton } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ProfileMenu from './ProfileMenu';
export default function AppBarMod(props) {
    const {
        handleDrawerToggle,
        curUser,
        handleSearchInput,
        handleMyAccount,
        handleLogOut,
    } = props;
    const searchBar = {
        width: '100%',
        padding: '10px',
        borderRadius: '6px',
        border: '0px',
    };
    const searchBarFocus = {
        width: '100%',
        padding: '10px',
        borderRadius: '6px',
        border: '0px',
        outline: 'none',
    };
    const ref = React.useRef();
    const [hasFocus, setFocus] = React.useState(false);
    React.useEffect(() => {
        if (
            document.hasFocus() &&
            ref.current.contains(document.activeElement)
        ) {
            setFocus(true);
        }
    }, []);

    return (
        <AppBar
            position='static'
            sx={{
                bgcolor: 'primary.main',
                color: 'primary.textLight',
            }}
        >
            <Toolbar>
                <IconButton
                    color='inherit'
                    aria-label='open drawer'
                    edge='start'
                    onClick={() => handleDrawerToggle()}
                    sx={{
                        ml: 0.5,
                        display: { md: 'flex', sm: 'none' },
                    }}
                >
                    <MenuBookIcon />
                </IconButton>
                <Grid
                    container
                    flexgrow='1'
                    alignItems='center'
                    justifyContent='center'
                >
                    <Grid
                        item
                        xs={4}
                        flexDirection='column'
                        justifyContent='center'
                        alignItems='center'
                    >
                        <input
                            style={!hasFocus ? searchBar : searchBarFocus}
                            placeholder='Wyszukaj użytkowników lub kontakty'
                            onChange={(event) =>
                                handleSearchInput(event.target.value)
                            }
                            onPaste={(event) =>
                                handleSearchInput(event.target.value)
                            }
                            ref={ref}
                            onFocus={() => setFocus(true)}
                            onBlur={() => setFocus(false)}
                        />
                    </Grid>
                </Grid>

                <ProfileMenu
                    curUser={curUser}
                    handleMyAccount={handleMyAccount}
                    handleLogOut={handleLogOut}
                ></ProfileMenu>
            </Toolbar>
        </AppBar>
    );
}
