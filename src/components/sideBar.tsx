import React from 'react';
import { Box, Avatar, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import PostAddIcon from '@mui/icons-material/PostAdd';

const Sidebar = ({ userDetails }) => {
  return (
    <Box sx={styles.sidebar}>
      <Box sx={styles.profile}>
        <Avatar sx={styles.avatar}>{userDetails.firstName.charAt(0)}{userDetails.lastName.charAt(0)}</Avatar>
        <Typography sx={styles.username}>{userDetails.firstName} {userDetails.lastName}</Typography>
        <Typography>{userDetails.email}</Typography>
        <Typography sx={styles.status}>Online</Typography>
      </Box>
      <List>
        <ListItem button>
          <ListItemIcon>
            <ThumbUpIcon />
          </ListItemIcon>
          <ListItemText primary="Likes" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <PostAddIcon />
          </ListItemIcon>
          <ListItemText primary="My Posts" />
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;

const styles = {
  sidebar: {
    width: '250px',
    display: 'flex',
    flexDirection: 'column',
    padding: '10px',
    borderRight: '1px solid #e1e8ed',
    height: '100vh',
    overflowY: 'auto',
  },
  profile: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '20px',
  },
  avatar: {
    width: '60px',
    height: '60px',
    marginBottom: '10px',
  },
  username: {
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  status: {
    color: 'green',
  },
};
