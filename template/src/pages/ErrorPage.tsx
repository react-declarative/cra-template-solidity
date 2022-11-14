import React from 'react';

import { makeStyles } from '../styles/makeStyles';

import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

import Logo from '../components/common/Logo';

const useStyles = makeStyles()({
    root: {
        position: 'relative',
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: 15,
    },
    container: {
        flex: 1,
        minWidth: 375,
        maxWidth: 375,
        padding: 15,
    },
});

export const ErrorPage = () => {
    const { classes } = useStyles();

    const handleReload = () => {
        window.location.reload();
    };

    return (
        <Box className={classes.root}>
            <Paper className={classes.container}>
                <Stack direction='column' gap="15px">
                    <Logo />
                    <span>
                        It looks like DAPP finished with uncaught exception<span className="emoji">😐</span><br />
                        Please reload this page and try again
                    </span>
                    <Button
                        variant="contained"
                        onClick={handleReload}
                    >
                        Reload page
                    </Button>
                </Stack>
            </Paper>
        </Box>
    );
};

export default ErrorPage;
