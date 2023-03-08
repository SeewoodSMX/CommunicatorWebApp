import * as React from 'react';
import {
    ListItemButton,
    ListItemIcon,
    Avatar,
    ListItemText,
    ListItem,
    Badge,
} from '@mui/material';

export default function Contact(props) {
    const { data, handleClick } = props;

    return (
        <ListItem disablePadding>
            <ListItemButton onClick={() => handleClick(data)}>
                <ListItemIcon>
                    <Badge
                        variant='dot'
                        invisible={!data.isOnline}
                        color='success'
                    >
                        <Avatar
                            sx={{
                                color: 'primary.main',
                                bgcolor: 'primary.textLight',
                                width: 32,
                                height: 32,
                                fontSize: '1rem',
                            }}
                        >
                            {data.firstName[0] + data.lastName[0]}
                        </Avatar>
                    </Badge>
                </ListItemIcon>
                <ListItemText primary={`${data.firstName} ${data.lastName}`} />
            </ListItemButton>
        </ListItem>
    );
}
