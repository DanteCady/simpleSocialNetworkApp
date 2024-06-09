// IMPORTS //

import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

// INITIALIZATION //
const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS

// DATABASE CONNECTION //
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});

/// ROUTES //

// Submit a new post
app.post('/submit-post', (req, res) => {
  const { user_id, content } = req.body;

  // Verify user_id is valid
  const userQuery = 'SELECT * FROM users WHERE user_id = ?';
  // Check if the user exists
  connection.query(userQuery, [user_id], (userErr, userResult) => {
    // If the user doesn't exist, return an error
    if (userErr || userResult.length === 0) {
      console.error(userErr);
      return res.status(400).send('Invalid user ID');
    }

    // If the user exists, insert the post
    const created_at = new Date();
    const query = 'INSERT INTO posts (user_id, content, created_at) VALUES (?, ?, ?)';
    connection.query(query, [user_id, content, created_at], (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Server error');
      } else {
        res.status(200).send('Post submitted successfully');
      }
    });
  });
});

// Get all posts
app.get('/posts', (req, res) => {
  // Get all posts and the username of the user who created them
  const query = `
    SELECT posts.*, users.username 
    FROM posts 
    INNER JOIN users ON posts.user_id = users.user_id
    ORDER BY posts.created_at DESC`;

  connection.query(query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
    } else {
      res.status(200).send(result);
    }
  });
});

// Login route
app.post('/login', (req, res) => {
  // Get the username and password from the request body
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  // Check if the username and password match a user in the database
  connection.query(query, [username, password], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
    } else {
      // If a user was found, return the user ID
      if (result.length > 0) {
        const user = result[0];
        res.status(200).send({ success: true, userId: user.user_id });
      } else {
        res.status(401).send({ success: false, message: 'Invalid credentials' });
      }
    }
  });
});

// Get user details
app.get('/users/:user_Id', (req, res) => {
  // Get the user ID from the request parameters
  const { user_Id } = req.params;
  // Query the database for the user with the given ID
  const query = 'SELECT user_id, userName, firstName, lastName, email FROM users WHERE user_id = ?';
  connection.query(query, [user_Id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
    } else {
      if (result.length > 0) {
        res.status(200).send(result[0]);
      } else {
        res.status(404).send('User not found');
      }
    }
  });
});

// Sign up route
app.post('/signup', (req, res) => {
  // Get the user details from the request body
  const { firstName, lastName, email, userName, password } = req.body;
  // Insert the new user into the database
  const query = 'INSERT INTO users (firstName, lastName, email, userName, password) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [firstName, lastName, email, userName, password], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
    } else {
      // If the user was inserted successfully, return the ID of the new user
      const userId = result.insertId; // Get the ID of the newly inserted user
      res.status(200).send({ success: true, userId });
    }
  });
});

// Increment like count
app.post('/posts/:postId/like', (req, res) => {
  // Get the post ID from the request parameters
  const { postId } = req.params;
  // Get the user ID and like type from the request body
  const { userId, likeType } = req.body;
  // Check if the user ID and like type are provided
  if (!userId || !likeType) {
    res.status(400).send('Missing userId or likeType');
    return;
  }
  // Insert the like into the database
  const query = 'INSERT INTO post_likes (post_id, user_id, like_type) VALUES (?, ?, ?) ' +
                'ON DUPLICATE KEY UPDATE like_type = VALUES(like_type)';
  connection.query(query, [postId, userId, likeType], (err) => {
    if (err) {
      console.error('Error inserting like:', err);
      res.status(500).send('Server error');
    } else {
      // Update the like and dislike counts for the post
      const updatePostQuery = `
        UPDATE posts
        SET likes = (SELECT COUNT(*) FROM post_likes WHERE post_id = ? AND like_type = 'like'),
            dislikes = (SELECT COUNT(*) FROM post_likes WHERE post_id = ? AND like_type = 'dislike')
        WHERE post_id = ?`;
      connection.query(updatePostQuery, [postId, postId, postId], (err) => {
        if (err) {
          console.error('Error updating post counts:', err);
          res.status(500).send('Server error');
        } else {
          // Fetch the users who liked the post
          const getUsersWhoLikedQuery = `
            SELECT users.user_id, users.userName, users.firstName, users.lastName
            FROM users
            INNER JOIN post_likes ON users.user_id = post_likes.user_id
            WHERE post_likes.post_id = ? AND post_likes.like_type = 'like'`;

          connection.query(getUsersWhoLikedQuery, [postId], (err, usersResult) => {
            if (err) {
              console.error('Error fetching users who liked:', err);
              res.status(500).send('Server error');
            } else {
              // Return the updated like/dislike counts and the users who liked the post
              res.status(200).send({
                message: 'Like/Dislike updated',
                usersWhoLiked: usersResult
              });
            }
          });
        }
      });
    }
  });
});

// Get posts liked by a user
app.get('/users/:userId/likes', (req, res) => {
  // Get the user ID from the request parameters
  const { userId } = req.params;
  // Fetch the posts liked by the user
  const query = `
    SELECT posts.*
    FROM posts
    INNER JOIN post_likes ON posts.post_id = post_likes.post_id
    WHERE post_likes.user_id = ? AND post_likes.like_type = 'like'`;

  connection.query(query, [userId], (err, result) => {
    if (err) {
      console.error('Error fetching liked posts:', err);
      res.status(500).send('Server error');
    } else {
      res.status(200).send(result);
    }
  });
});

// Increment dislike count
app.post('/posts/:postId/dislike', (req, res) => {
  // Get the post ID from the request parameters
  const { postId } = req.params;
  // Increment the dislike count for the post
  const query = 'UPDATE posts SET dislikes = dislikes + 1 WHERE post_id = ?';
  connection.query(query, [postId], (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
    } else {
      res.status(200).send('Dislike added');
    }
  });
});

// Get posts created by a user
app.get('/users/:userId/posts', (req, res) => {
  // Get the user ID from the request parameters
  const { userId } = req.params;
  // Fetch the posts created by the user
  // Include the total number of likes and dislikes for each post
  const query = `
    SELECT posts.*, 
           (SELECT COUNT(*) FROM post_likes WHERE post_likes.post_id = posts.post_id AND post_likes.like_type = 'like') AS total_likes,
           (SELECT COUNT(*) FROM post_likes WHERE post_likes.post_id = posts.post_id AND post_likes.like_type = 'dislike') AS total_dislikes
    FROM posts
    WHERE user_id = ?
    ORDER BY created_at DESC`;

  connection.query(query, [userId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
    } else {
      res.status(200).send(result);
    }
  });
});

//// SERVER LISTEN ////
///////////////////////
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
