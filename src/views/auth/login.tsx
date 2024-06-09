import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, Card, CardContent } from '@mui/material';
import axios from 'axios';
import BoltIcon from '@mui/icons-material/Bolt';

const Login = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [loginStatus, setLoginStatus] = useState('');
	const navigate = useNavigate();

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			const response = await axios.post('http://localhost:3001/login', {
				username: username,
				password: password,
			});
			console.log('Login response:', response);
			if (response.data.success) {
				localStorage.setItem('username', username);
			} else {
				setLoginStatus('Invalid username or password');
			}

			navigate('/feed');
		} catch (error) {
			console.error('There was an error logging in!', error);
		}
	};

	return (
		<Container maxWidth="sm" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
			<Card>
				<CardContent>
					<Typography variant="h4" component="h1" align="center" gutterBottom>
						SSSN APP
						<BoltIcon style={{ fontSize: 40, color: '#F8D53B' }} />
					</Typography>
					<Typography variant="h4" component="h1" align="center" gutterBottom>
						Login
					</Typography>
					<Typography variant="body1" align="center" gutterBottom>
						Enter your username and password
					</Typography>
					<form onSubmit={handleSubmit}>
						<TextField
							label="Username"
							variant="outlined"
							fullWidth
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
							margin="normal"
						/>
						<TextField
							label="Password"
							variant="outlined"
							fullWidth
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							margin="normal"
						/>
						{loginStatus && (
							<Typography variant="body1" align="center" gutterBottom>
								{loginStatus}
							</Typography>
						)}
						<Typography variant="body1" align="center" gutterBottom>
							Don't have an account? <a href="/signup">Sign up</a>
						</Typography>
						<Typography variant="body1" align="center" gutterBottom>
							Forgot your password? <a href="/forgot">Reset</a>
						</Typography>
						<Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '16px' }}>
							Submit
						</Button>
					</form>
				</CardContent>
			</Card>
		</Container>
	);
};

export default Login;
