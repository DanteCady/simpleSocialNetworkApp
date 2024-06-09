import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Card, CardContent, CircularProgress, Box } from '@mui/material';
import AppBar from '../../components/AppBar';
import Sidebar from '../../components/Sidebar';

const Activity = () => {
  const [myActivity, setMyActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLikedPosts = async () => {
      try {
        const userDetails = JSON.parse(localStorage.getItem('userDetails'));
        const userId = userDetails.user_id;
        const response = await axios.get(`http://localhost:3001/users/${userId}/likes`);
        setMyActivity(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError('There was an error fetching liked posts.');
        console.error('There was an error fetching liked posts:', error);
      }
    };

    fetchLikedPosts();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  const userDetails = JSON.parse(localStorage.getItem('userDetails'));

  return (
    <>
      <AppBar userDetails={userDetails || ''} />
      <Box sx={{ display: 'flex' }}>
        <Sidebar userDetails={userDetails || ''} />
        <Container maxWidth="md" sx={{ marginTop: 8 }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Liked Posts
          </Typography>
          {myActivity.length === 0 ? (
            <Typography variant="body1" align="center">
              You have not liked any posts yet.
            </Typography>
          ) : (
            myActivity.map(post => (
              <Card key={post.post_id} sx={{ marginBottom: '16px' }}>
                <CardContent>
                  <Typography variant="h6">{post.content}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {new Date(post.created_at).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            ))
          )}
        </Container>
      </Box>
    </>
  );
};

export default Activity;
