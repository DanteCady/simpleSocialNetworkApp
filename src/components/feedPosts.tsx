import axios from 'axios';
import React, { useState } from 'react';
import { Button, Typography, Box, Paper } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
// import ThumbDownIcon from '@mui/icons-material/ThumbDownAltOutlined';

const FeedPost = ({ post }) => {
  const [likes, setLikes] = useState(post.likes);
  const [dislikes, setDislikes] = useState(post.dislikes);

  const handleLike = () => {
    axios.post('http://localhost:3001/like', { post_id: post.post_id })
      .then((response) => {
        console.log(response);
        setLikes(likes + 1);
      })
      .catch((error) => {
        console.error('Error liking post:', error);
      });
  };

  const handleDislike = () => {
    axios.post('http://localhost:3001/dislike', { post_id: post.post_id })
      .then((response) => {
        console.log(response);
        setDislikes(dislikes + 1);
      })
      .catch((error) => {
        console.error('Error disliking post:', error);
      });
  };

  return (
    <Paper elevation={3} style={styles.postContainer}>
      <Typography variant="body1" style={styles.postText}>{post.content}</Typography>
      <Box display="flex" alignItems="center">
        <Button onClick={handleLike}  color="primary" style={styles.likeButton}>
          <FavoriteBorderIcon />
        </Button>
        <Typography variant="body1">{likes}</Typography>
        {/* <Button onClick={handleDislike} variant="contained" color="error" style={styles.dislikeButton}>
          <ThumbDownIcon />
        </Button> */}
        <Typography variant="body1">{dislikes}</Typography>
      </Box>
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
  likeButton: {
    marginRight: '10px',
  },
  dislikeButton: {
    marginLeft: '10px',
  },
};
