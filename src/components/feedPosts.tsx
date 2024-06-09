import React, { useState } from 'react';
import { Typography, Box, Paper, Button } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ThumbDownIcon from '@mui/icons-material/ThumbDownAltOutlined';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';

import axios from 'axios';

const FeedPost = ({ post }) => {
  const [likes, setLikes] = useState(post.likes);
  const [dislikes, setDislikes] = useState(post.dislikes);
  const [userInteraction, setUserInteraction] = useState(null); // 'like' or 'dislike'

  const handleLike = () => {
    if (userInteraction === 'like') {
      setLikes(likes - 1);
      setUserInteraction(null);
    } else {
      if (userInteraction === 'dislike') {
        setDislikes(dislikes - 1);
      }
      setLikes(likes + 1);
      setUserInteraction('like');
    }
    axios.post(`http://localhost:3001/posts/${post.post_id}/like`)
      .catch((error) => {
        console.error('Error liking post:', error);
      });
  };

  const handleDislike = () => {
    if (userInteraction === 'dislike') {
      setDislikes(dislikes - 1);
      setUserInteraction(null);
    } else {
      if (userInteraction === 'like') {
        setLikes(likes - 1);
      }
      setDislikes(dislikes + 1);
      setUserInteraction('dislike');
    }
    axios.post(`http://localhost:3001/posts/${post.post_id}/dislike`)
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
          <Button 
            onClick={handleLike} 
            color={userInteraction === 'like' ? 'primary' : 'inherit'}
            style={styles.button}
          >
            {userInteraction === 'like' ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </Button>
          <Typography variant="body1">{likes}</Typography>
          <Button 
            onClick={handleDislike} 
            color={userInteraction === 'dislike' ? 'error' : 'inherit'}
            style={styles.button}
          >
            {userInteraction === 'dislike' ? <ThumbDownAltIcon /> : <ThumbDownIcon />}
          </Button>
          <Typography variant="body1">{dislikes}</Typography>
        </Box>
      </Box>
      <Typography sx={{color: 'grey', fontSize:'12px'}}>
        Posted by: {post.username} on {new Date(post.created_at).toLocaleString()}
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
