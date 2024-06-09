import React from 'react';
import { AppBar as MuiAppBar, Toolbar, Typography, Button, Avatar, Box} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BoltIcon from '@mui/icons-material/Bolt';

const AppBar = ({userDetails}) => {
	const navigate = useNavigate();

	const handleLogout = () => {
		console.log('Logout');
		localStorage.removeItem('userDetails');
		navigate('/login');
	}
	const handleAccount = () => {
		console.log('Account');
		navigate('/account');
	}

	return (
		<MuiAppBar position="static" sx={{width: '100%'}}>
			<Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
				<Box style={{ display: 'flex', alignItems: 'center' }}>
					<Typography variant="h6" >
						SSNS
					</Typography>
					<BoltIcon sx={{ marginLeft: '10px', height: '35px' }} />
				</Box>
				<Box style={{ display: 'flex', alignItems: 'center' }}>
					<Button onClick={handleAccount}>
					<Avatar>{userDetails.firstName.charAt(0)}{userDetails.lastName.charAt(0)}</Avatar>
					</Button>
					<Button color="inherit" onClick={handleLogout}>Logout</Button>
				</Box>
			</Toolbar>
		</MuiAppBar>
	);
};

export default AppBar;
