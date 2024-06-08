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
  const query = 'SELECT * FROM posts';
  connection.query(query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
    } else {
      res.status(200).send(result);
    }
  }
  );
});


// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    connection.query(query, [username, password], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Server error');
      } else {
        if (result.length > 0) {
          res.status(200).send('Login successful');
        } else {
          res.status(401).send('Invalid credentials');
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

app.post('/posts/:postId/like', (req, res) => {
  const { postId } = req.params;
  // Increment the like count in database
  Post.findByIdAndUpdate(postId, { $inc: { likes: 1 } }, { new: true }, (err, post) => {
    if (err) return res.status(500).send(err);
    res.send(post);
  });
});

app.post('/posts/:postId/dislike', (req, res) => {
  const { postId } = req.params;
  // Increment the dislike count in database
  Post.findByIdAndUpdate(postId, { $inc: { dislikes: 1 } }, { new: true }, (err, post) => {
    if (err) return res.status(500).send(err);
    res.send(post);
  });
});


app.listen(process.env.PORT, () => {
  console.log('Server is running on port ${process.env.PORT}');
});