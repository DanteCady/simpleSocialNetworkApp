import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Card, CardContent, Typography, Container } from '@mui/material';
import axios from 'axios';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const userDetails = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3001/users/${userId}`);
      console.log('User details:', response.data);
      localStorage.setItem('userDetails', JSON.stringify(response.data));
    } catch (error) {
      console.error('There was an error fetching user details!', error);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!firstName ||!lastName || !email || !userName || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/signup', {
        firstName,
        lastName,
        email,
        userName,
        password,
      });
      const userId = response.data.userId;
      await userDetails(userId); // Fetch and store user details
      setLoading(false);
      navigate('/feed');
    } catch (error) {
      setLoading(false);
      setError('There was an error signing up. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card>
        <CardContent>
          <Typography variant="h4" component="h1" align="center" gutterBottom>Signup</Typography>
          <Typography variant="body1" align="center" gutterBottom>Signup to create an account</Typography>
          <form onSubmit={handleSubmit}>
            {error && <Typography variant="body1" color="error" align="center" gutterBottom>{error}</Typography>}
            <TextField
              label="Firstname"
              variant="outlined"
              fullWidth
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              margin="normal"
            />
             <TextField
              label="Lastname"
              variant="outlined"
              fullWidth
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              margin="normal"
            />
             <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              margin="normal"
            />
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={userName}
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
            <TextField
              label="Confirm Password"
              variant="outlined"
              fullWidth
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              style={{ marginTop: '16px' }}
            >
              {loading ? 'Loading...' : 'Submit'}
            </Button>
          </form>
          <Typography variant="body1" align="center" style={{ marginTop: '16px' }}> Already have an account? <Button color="primary" onClick={() => navigate('/login')}>Login</Button></Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Signup;
