import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Card, CardContent, CircularProgress } from '@mui/material';

const Activity = () => {
  const [myActivity, setLikedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLikedPosts = async () => {
      try {
        const userDetails = JSON.parse(localStorage.getItem('userDetails'));
        const userId = userDetails.user_id;
        const response = await axios.get(`http://localhost:3001/users/${userId}/liked-posts`);
        setLikedPosts(response.data);
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

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Liked Posts
      </Typography>
      {setLikedPosts.length === 0 ? (
        <Typography variant="body1" align="center">
          You have not liked any posts yet.
        </Typography>
      ) : (
        setLikedPosts.map(post => (
          <Card key={post.post_id} style={{ marginBottom: '16px' }}>
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
  );
};

export default Activity;
