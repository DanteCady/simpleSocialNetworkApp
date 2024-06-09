import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import mysql from 'mysql2'
import cors from 'cors'



const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER, 
    password:  process.env.DB_PASSWORD,
    database:  process.env.DB_NAME, 
  });

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});


app.post('/submit-post', (req, res) => {
  const { user_id, content } = req.body;

  // Verify user_id is valid
  const userQuery = 'SELECT * FROM users WHERE user_id = ?';
  connection.query(userQuery, [user_id], (userErr, userResult) => {
    if (userErr || userResult.length === 0) {
      console.error(userErr);
      return res.status(400).send('Invalid user ID');
    }

    const created_at = new Date();
    const query = 'INSERT INTO posts (user_id, content, created_at) VALUES (?, ?, ?)';
    connection.query(query, [user_id, content, created_at], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Server error');
      } else {
        res.status(200).send('Post submitted successfully');
      }
    });
  });
});
app.get('/posts', (req, res) => {
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
  const { username, password } = req.body;

  // Verify user credentials
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  connection.query(query, [username, password], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
    } else {
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
  const { user_Id } = req.params;
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
  const { firstName, lastName, email, userName, password } = req.body;
  const query = 'INSERT INTO users (firstName, lastName, email, userName, password) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [firstName, lastName, email, userName, password], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
    } else {
      const userId = result.insertId; // Get the ID of the newly inserted user
      res.status(200).send({ success: true, userId });
    }
  });
});


// Increment like count
app.post('/posts/:postId/like', (req, res) => {
  const { postId } = req.params;
  const { userId, likeType } = req.body; 

  const query = 'INSERT INTO post_likes (post_id, user_id, like_type) VALUES (?, ?, ?) ' +
                'ON DUPLICATE KEY UPDATE like_type = VALUES(like_type)';
  connection.query(query, [postId, userId, likeType], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
    } else {
      const updatePostQuery = `
        UPDATE posts
        SET likes = (SELECT COUNT(*) FROM post_likes WHERE post_id = ? AND like_type = 'like'),
            dislikes = (SELECT COUNT(*) FROM post_likes WHERE post_id = ? AND like_type = 'dislike')
        WHERE post_id = ?`;
      
      connection.query(updatePostQuery, [postId, postId, postId], (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send('Server error');
        } else {
          res.status(200).send('Like/Dislike updated');
        }
      });
    }
  });
});

app.get('/posts/:postId/likes', (req, res) => {
  const { postId } = req.params;

  const query = 'SELECT user_id, like_type FROM post_likes WHERE post_id = ?';
  connection.query(query, [postId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
    } else {
      res.status(200).send(result);
    }
  });
});


// Increment dislike count
app.post('/posts/:postId/dislike', (req, res) => {
  const { postId } = req.params;
  const query = 'UPDATE posts SET dislikes = dislikes + 1 WHERE post_id = ?';
  connection.query(query, [postId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
    } else {
      res.status(200).send('Dislike added');
    }
  });
});

app.listen(process.env.PORT, () => {
  console.log('Server is running on port ${process.env.PORT}');
});