import * as React from 'react';
import { Grid, ListItem, ListItemText } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Message(props) {
    const { msgData, deleteMsg } = props;
    const [display, setDisplay] = React.useState('none');
    return (
        <ListItem
            onMouseEnter={() => {
                setDisplay('flex');
            }}
            onMouseLeave={() => {
                setDisplay('none');
            }}
        >
            <Grid
                container
                textAlign={
                    msgData.userToChat === msgData.curUser ? 'right' : 'left'
                }
                direction={
                    msgData.userToChat === msgData.curUser
                        ? 'row'
                        : 'row-reverse'
                }
            >
                <Grid container item xs>
                    <Grid item xs={12}>
                        <ListItemText primary={msgData.msg}></ListItemText>
                    </Grid>
                    <Grid item xs={12}>
                        <ListItemText
                            secondary={msgData.sendDate}
                        ></ListItemText>
                    </Grid>
                </Grid>
                {msgData.userToChat === msgData.curUser && (
                    <Grid item xs='auto' display={display}>
                        <IconButton
                            aria-label='delete'
                            sx={{ marginTop: '8px' }}
                            onClick={() => {
                                deleteMsg(msgData.id);
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Grid>
                )}
            </Grid>
        </ListItem>
    );
}
