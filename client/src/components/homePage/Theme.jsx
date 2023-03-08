import { createTheme, alpha } from '@mui/material/styles';
export const theme = createTheme({
    palette: {
        primary: {
            main: '#dc3545', //#f44333
            textDark: '#000000',
            textLight: 'white',
            //op: alpha('#f44333', 0.5),
        },
        secondary: {
            main: '#ededed',
        },
        label: {
            main: 'gray',
        },
    },
});
