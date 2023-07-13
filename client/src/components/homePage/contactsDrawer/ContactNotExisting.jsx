import * as React from 'react';
import { Grid, Fab, Typography, Box } from '@mui/material';

import AddCircleIcon from '@mui/icons-material/AddCircle';
export default function ContactNotExisting(props) {
    const { usr, addContact, i } = props;

    return (
        <Box
            key={i}
            sx={{
                bgcolor: '#ededed',
                textAlign: 'left',
                margin: '0.4rem',
                borderRadius: '10px',
                padding: '5px 0px',
            }}
        >
            <Grid container direction='row'>
                <Grid item p={1.1} xs>
                    <Typography>
                        {usr.firstName +
                            ' ' +
                            usr.lastName +
                            ' ' +
                            usr.username}
                    </Typography>
                </Grid>
                <Grid item align='right' mr='5px' mt='1px'>
                    <Fab
                        color='primary'
                        aria-label='add-contact'
                        onClick={() => {
                            addContact(usr);
                        }}
                        size='small'
                    >
                        <AddCircleIcon />
                    </Fab>
                </Grid>
            </Grid>
        </Box>
    );
}
