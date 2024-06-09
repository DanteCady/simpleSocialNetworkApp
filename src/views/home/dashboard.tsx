import React from 'react';
import { Box, Container } from '@mui/material';
import FeedContainer from '../../components/FeedContainer';
import AppBar from '../../components/AppBar';
import Sidebar from '../../components/sideBar';

const Dashboard = () => {
  const userDetials = JSON.parse(localStorage.getItem('userDetails'))

  return (
    <>
      <AppBar />
      <Box sx={styles.page}>
        <Sidebar userDetails={userDetials || ''} />
        <Box sx={styles.mainContent}>
          <FeedContainer />
        </Box>
      </Box>
    </>
  );
};

export default Dashboard;

const styles = {
  page: {
    display: 'flex',
    justifyContent: 'center',
    height: '100vh',
    width: '100vw',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    overflowY: 'auto',
  },
};
