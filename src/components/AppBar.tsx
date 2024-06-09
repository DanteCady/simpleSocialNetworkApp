import React from 'react';
import { AppBar as MuiAppBar, Toolbar, Typography, Button, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BoltIcon from '@mui/icons-material/Bolt';

const AppBar = () => {
	const navigate = useNavigate();

	const handleLogout = () => {
		console.log('Logout');
		navigate('/login');
	}

	return (
		<MuiAppBar position="static">
			<Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<Typography variant="h6" component="div">
						SSNS
					</Typography>
					<BoltIcon sx={{ marginLeft: '10px', height: '35px' }} />
				</div>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<Avatar alt="User Avatar" src="/path/to/avatar.jpg" sx={{ marginRight: '10px' }} />
					<Button color="inherit" onClick={handleLogout}>Logout</Button>
				</div>
			</Toolbar>
		</MuiAppBar>
	);
};

export default AppBar;
