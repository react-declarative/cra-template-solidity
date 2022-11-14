import React from 'react';

import { makeStyles } from '../styles/makeStyles';

import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

import Logo from '../components/common/Logo';

import ioc from '../lib/ioc';

const useStyles = makeStyles()({
    root: {
        position: 'relative',
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 15,
        padding: 15,
    },
    container: {
        flex: 1,
        minWidth: 375,
        maxWidth: 375,
        padding: 15,
    },
});

export const ConnectPage = () => {
    const { classes } = useStyles();
    return (
        <Box className={classes.root}>
            <Paper className={classes.container}>
                <Stack direction='column' gap="15px">
                    <Logo />
                    <span>
                        Please, connect your <strong>MetaMask</strong> wallet <span className="emoji">😃</span><br />
                    </span>
                    <Button
                        variant="contained"
                        onClick={ioc.connectService.handleConnectClick}
                    >
                        Connect wallet
                    </Button>
                </Stack>
            </Paper>
        </Box>
    );
};

export default ConnectPage;
