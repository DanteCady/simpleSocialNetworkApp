import React, { useRef } from 'react';
import { Typography, Box, TextareaAutosize, Button, Paper } from '@mui/material';
import axios from 'axios';

const CreatePostModal = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const userDetails = JSON.parse(localStorage.getItem('userDetails'));

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    if (formRef.current) {
      const data = new FormData(formRef.current);
      const post = {
        user_id: userDetails.user_id, 
        content: data.get('content'),
      };
      axios.post('http://localhost:3001/submit-post', post)
        .then((response) => {
          console.log(response.data);
          window.location.reload();
        })
        .catch((error) => {
          console.error('Error submitting post:', error);
        });
    }
  };

  return (
    <Paper elevation={3} style={styles.form}>
      <Typography variant="body1">Create Your Post</Typography>
      <form ref={formRef} onSubmit={handleSubmit}>
        <Box mt={1} mb={2}>
          <TextareaAutosize
            aria-label="content"
            placeholder="Write your post here..."
            name="content" 
            style={styles.textArea}
          />
        </Box>
        <Button type="submit" variant="contained" color="primary">Submit</Button>
      </form>
    </Paper>
  );
};

export const styles = {
  textArea: {
    width: '100%',
    minHeight: '100px',
    backgroundColor: '#f9f9f9',
    color: '#14171a',
    resize: 'none',
    border: 'none',
    outline: 'none',
    padding: '8px',
    borderRadius: '4px',
  },
  form: {
    padding: '20px',
    borderRadius: '5px',
    marginBottom: '20px',
  },
};

export default CreatePostModal;
