import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import axios from 'axios';
import CreatePost from '../components/CreatePost';
import FeedPost from '../components/feedPosts';

const FeedContainer = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/posts')
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
      });
  }, []);

  return (
    <Container maxWidth="md">
      <Box mt={4} mb={2}>
        <Typography variant="h4" align="center" gutterBottom>See What's Happening!</Typography>
        <Box mb={2}>
          <CreatePost />
        </Box>
      </Box>
      <Paper>
        {posts.length > 0 ? (
          posts.map(post => <FeedPost key={post.post_id} post={post} />)
        ) : (
          <Box p={2}>
            <Typography variant="body1" align="center">No posts available</Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default FeedContainer;
