import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import axios from 'axios';
import CreatePost from '../components/CreatePost';
import FeedPost from '../components/feedPosts';

const FeedContainer = () => {
  const [posts, setPosts] = useState([]);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/posts')
      .then(response => {
        console.log('Fetched posts:', response.data); // Debug: Log fetched posts
        setPosts(response.data);
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
      });

    const connectWebSocket = () => {
      const socket = new WebSocket('ws://localhost:8080');
      setWs(socket);

      socket.onopen = () => {
        console.log('WebSocket connection established');
      };

      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'NEW_POST') {
          console.log('New post received:', message.post); // Debug: Log new post
          setPosts(prevPosts => [message.post, ...prevPosts]);
        }
      };

      socket.onclose = () => {
        console.log('WebSocket connection closed. Attempting to reconnect...');
        setTimeout(connectWebSocket, 1000);  // Reconnect after 1 second
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
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
          posts.map((post, index) => {
            // console.log('Rendering post:', post); // Debug: Log each post being rendered
            return (
              <FeedPost key={`${post.post_id}-${index}`} post={post} />
            );
          })
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
