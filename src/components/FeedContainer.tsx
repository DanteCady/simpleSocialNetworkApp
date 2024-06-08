import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { globalStyles } from '../styles/styles';
import CreatePost from './CreatePost';
import FeedPost from './feedPosts';

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
    <>
      <div style={styles.container}>
        <p style={styles.header}>See What's Happening!</p>
        <div style={styles.createPostContainer}>
          <CreatePost />
        </div>
      </div>
      <div style={styles.feedContainer}>
        {posts.length > 0 ? (
          posts.map(post => <FeedPost key={post.post_id} post={post} />)
        ) : (
          <p style={globalStyles.text}>No posts available</p>
        )}
      </div>
    </>
  );
};

export default FeedContainer;

export const styles = {
  createPostContainer: {
    marginBottom: '20px',
  },
  container: {
    backgroundColor: 'transparent',
    width: '800px',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #e1e8ed',
    height: '100%',
    overflowY: 'none',
  },
  header: {
    padding: '10px',
    borderBottom: '1px solid #e1e8ed',
    fontSize: '20px',
    color: '#14171a',
  },
  feedContainer: {
    backgroundColor: '#f5f8fa',
    width: '800px',
    display: 'flex',
    flexDirection: 'column',
    height: '400px', // Set a fixed height for the scrollable area
    overflowY: 'auto', // Enable vertical scrolling
    border: '1px solid #e1e8ed',
  },
};
