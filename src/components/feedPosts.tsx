import React, { useState } from 'react';

const FeedPost = ({ post }) => {
  const [likes, setLikes] = useState(post.likes);
  const [dislikes, setDislikes] = useState(post.dislikes);

  const handleLike = () => {
    //TODO: Implement like functionality
    setLikes(likes + 1);
  };

  const handleDislike = () => {
    // TODO: Implement dislike functionality
    setDislikes(dislikes + 1);
  };

  return (
    <div style={styles.postContainer}>
      <p style={styles.postText}>{post.content}</p>
      <div style={styles.buttonContainer}>
        <button onClick={handleLike} style={styles.likeButton}>Like</button>
        <span>{likes}</span>
        <button onClick={handleDislike} style={styles.dislikeButton}>Dislike</button>
        <span>{dislikes}</span>
      </div>
    </div>
  );
};

export default FeedPost;

const styles = {
  postContainer: {
    borderBottom: '1px solid #e1e8ed',
    padding: '10px',
  },
  postText: {
    marginBottom: '10px',
    color : '#14171a',
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  likeButton: {
    marginRight: '10px',
    backgroundColor: '#00aaff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '5px 10px',
    cursor: 'pointer',
  },
  dislikeButton: {
    marginLeft: '10px',
    backgroundColor: '#ff0000',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '5px 10px',
    cursor: 'pointer',
  },
};
