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
          res.status(200).send('Login successful');
          res.send(result);
        } else {
          res.status(401).send('Invalid credentials');
        }
      }
    });
  });

// Get user details
app.get('/users/:user_Id', (req, res) => {
  const { user_Id } = req.params;
  const query = 'SELECT * FROM users WHERE user_id = ?';
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
  const { username, password } = req.body;

  const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
  connection.query(query, [username, password], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
    } else {
      res.status(200).send('User registered successfully');
    }
  });
});

// Increment like count
app.post('/posts/:postId/like', (req, res) => {
  const { postId } = req.params;
  const query = 'UPDATE posts SET likes = likes + 1 WHERE post_id = ?';
  connection.query(query, [postId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
    } else {
      res.status(200).send('Like added');
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