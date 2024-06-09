import React, { useState } from 'react';
import { Typography, Box, Paper, Button } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ThumbDownIcon from '@mui/icons-material/ThumbDownAltOutlined';
import axios from 'axios';

const FeedPost = ({ post }) => {
  const [likes, setLikes] = useState(post.likes);
  const [dislikes, setDislikes] = useState(post.dislikes);

  const handleLike = () => {
    axios.post(`http://localhost:3001/posts/${post.post_id}/like`)
      .then((response) => {
        setLikes(likes + 1);
      })
      .catch((error) => {
        console.error('Error liking post:', error);
      });
  };

  const handleDislike = () => {
    axios.post(`http://localhost:3001/posts/${post.post_id}/dislike`)
      .then((response) => {
        setDislikes(dislikes + 1);
      })
      .catch((error) => {
        console.error('Error disliking post:', error);
      });
  };

  return (
    <Paper elevation={3} style={styles.postContainer}>
      <Typography variant="body1" style={styles.postText}>
       {post.content}
      </Typography>
      <Box display="flex" alignItems="center">
        <Box style={styles.buttonContainer}>
          <Button onClick={handleLike} color="primary" style={styles.button}>
            <FavoriteBorderIcon />
          </Button>
          <Typography variant="body1">{likes}</Typography>
          <Button onClick={handleDislike} color="error" style={styles.button}>
            <ThumbDownIcon />
          </Button>
          <Typography variant="body1">{dislikes}</Typography>
        </Box>
      </Box>
      <Typography sx={{color: 'grey', fontSize:'12px'}}>
        Posted by: {post.username}
      </Typography>
    </Paper>
  );
};

export default FeedPost;

const styles = {
  postContainer: {
    marginBottom: '20px',
    padding: '10px',
  },
  postText: {
    marginBottom: '10px',
    color: '#14171a',
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '20px',
  },
  button: {
    marginRight: '5px',
  },
};
