import React from 'react';
import { Box, Container } from '@mui/material';
import FeedContainer from '../../components/FeedContainer';
import AppBar from '../../components/AppBar';

const Feed = () => {
  return (
    <>
      <AppBar />
      <Box sx={styles.page}>
        <Container sx={styles.container}>
          <FeedContainer />
        </Container>
      </Box>
    </>
  );
};

export default Feed;

const styles = {
  page: {
    justifyContent: 'center',
    height: 'auto',
    width: 'auto',
  },
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  sidebar: {
    width: '200px',
    display: 'flex',
    flexDirection: 'column',
    padding: '10px',
    border: '1px solid #e1e8ed',
    height: 'calc(100vh - 40px)',
    overflowY: 'auto',
  },
  text: {
    color: '#14171a',
    fontSize: '16px',
  },
};
