import React from 'react';
import { AppBar as MuiAppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AppBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('Logout');
    navigate('/login');
  }

  return (
    <MuiAppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          SSNS
        </Typography>
        <Button color="inherit" onClick={handleLogout}>Logout</Button>
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
