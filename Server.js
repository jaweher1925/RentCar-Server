
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');


const app = express();
const port = 4300;

//Use CORS middleware
app.use(cors());

//connected to MySQL DB 
const db = mysql.createConnection({
  host: '127.0.0.1',
  port: '3306',
  user: 'root',
  password: '',
  database: 'Car'
});


db.connect(err => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
  } else {
    console.log('Connecté à la base de données MySQL');
  }
});


app.use(express.json());


// Middleware for error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});


/***********************************
 * 
 * 
 * ***Login ****
 * 
 *********************************/

// User login
app.post('/login', (req, res) => {
  const { username, passuser } = req.body;

  if (!username || !passuser) {
    return res.status(400).json({ error: 'Username and passuser are required.' });
  }

  const query = 'SELECT * FROM user WHERE username = ? AND passuser = ?';

  db.query(query, [username, passuser], (err, results) => {
    if (err) {
      console.error('Error during login:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (results.length === 0) {
      res.status(401).json({ error: 'Invalid username or passuser.' });
    } else {
      res.json({ message: 'Login succes sful' });
    }
  });
});

app.get('/logout',(req,res)=>{
  const {username,passuser}=req.body;
  
  const index = activeSessions.findIndex(session => session.sessionId === sessionId);
  if (index !== -1) {
    activeSessions.splice(index, 1);
    res.json({ message: 'Logout successful' });
  } else {
    res.status(404).json({ error: 'Session not found' });
  }
})
/**********************************************************************
**
**
********Server User (CRUD)
**
**
***********************************************************************/
//add user ( regestration )
app.post('/user', (req, res) => {
  try {
    const { username, passuser } = req.body;

    if (!username || !passuser) {
      return res.status(400).json({ error: 'All user information is required.' });
    }

    const query = 'INSERT INTO user (username	, passuser) VALUES (?,?)';
    db.query(query, [username, passuser], (err, results) => {
      if (err) {
        console.error('Error adding user:', err);

        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json({ message: 'user added successfully.' });
      }
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//liste-user
app.get('/users', (req, res) => {
  const query = 'SELECT * FROM user';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des users', err);
      res.status(500).send('Erreur serveur');
    } else {
      res.json(results);
    }
  });
});

//get By Id 
app.get('/users/:userId', (req, res) => {
  const userId = req.params.userId;

  const query = 'SELECT * FROM user WHERE userId = ?';
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error retrieving user by ID:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'User not found!!'});
    } else {
      res.json(results[0]);
    }
  });
});



//delete  user
app.delete('/user/:userId', (req, res) => {
  const userId = req.params.userId;

  const query = 'DELETE FROM user WHERE userId = ?';
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error deleting user:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: 'user not found' });
    } else {
      res.json({ message: 'user deleted successfully' });
    }
  });
});


//update user

app.put('/users/:userId', (req, res) => {
  const userId = req.params.userId;
  const { username, passuser } = req.body;


  if (!username || !passuser) {
    return res.status(400).json({ error: 'All user information is required.' });
  }

  const query = 'UPDATE user SET username=?	, passuser=? ';
  db.query(query, [username, passuser], (err, results) => {
    if (err) {
      console.error('Error updating user:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json({ message: 'User updated successfully' });
    }
  });
});

/**********************************************************************
**
**
********Server Car (CRUD)
**
**
***********************************************************************/
//liste-car
app.get('/cars', (req, res) => {
  const query = 'SELECT * FROM Cars';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des voitures:', err);
      res.status(500).send('Erreur serveur');
    } else {
      res.json(results);
    }
  });
});

//get By Id 
app.get('/cars/:carId', (req, res) => {
  const carId = req.params.carId;

  const query = 'SELECT * FROM cars WHERE carId = ?';
  db.query(query, [carId], (err, results) => {
    if (err) {
      console.error('Error retrieving car by ID:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'Car not found' });
    } else {
      res.json(results[0]);
    }
  });
});

//add car
app.post('/cars', (req, res) => {
  try {
    const { Model, Color, DailyPrice, Description, image ,localisation} = req.body;

    if (!Model || !Color || !DailyPrice || !Description || !image || !localisation) {
      return res.status(400).json({ error: 'All car information is required.', missingFields: ['Model', 'Color', 'DailyPrice', 'Description', 'image', 'localisation'] });
    }

    const query = 'INSERT INTO Cars (Model, Color, DailyPrice, Description, image,localisation) VALUES (?, ?,?, ?, ?,?)';
    db.query(query, [Model, Color, DailyPrice, Description, image,localisation], (err, results) => {
      if (err) {
        console.error('Error adding car:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json({ message: 'Car added successfully.' });
      }
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//delete 

app.delete('/cars/:carId', (req, res) => {
  const carId = req.params.carId;

  const query = 'DELETE FROM cars WHERE carId = ?';
  db.query(query, [carId], (err, results) => {
    if (err) {
      console.error('Error deleting car:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Car not found' });
    } else {
      res.json({ message: 'Car deleted successfully' });
    }
  });
});


//update 

app.put('/cars/:carId', (req, res) => {
  const carId = req.params.carId;
  const { Model, Color, DailyPrice, Description, image,localisation } = req.body;


  if (!Model || !Color || !DailyPrice || !Description || !image || !localisation) {
    return res.status(400).json({ error: 'All car information is required.' });
  }

  const query = 'UPDATE cars SET Model = ?, Color = ?, DailyPrice = ?, Description = ?, image = ?,localisation=? WHERE carId = ?';
  db.query(query, [Model, Color, DailyPrice, Description, image, carId,localisation], (err, results) => {
    if (err) {
      console.error('Error updating car:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Car not found' });
    } else {
      res.json({ message: 'Car updated successfully' });
    }
  });
});


/**********************************************************************
**
**
********Server Booking(CRUD)
**
**
**********************************************************************/

app.post('/bookings', (req, res) => {
  try {
      const { carId, userId, startdate, enddate } = req.body;

      if (!carId || !userId || !startdate || !enddate) {
          return res.status(400).json({ error: 'All booking information is required.' });
      }

      const query = 'INSERT INTO booking (carId, userId, startdate, enddate) VALUES (?, ?, ?, ?)';
      db.query(query, [carId, userId, startdate, enddate], (err, results) => {
          if (err) {
              console.error('Error creating booking:', err);
              res.status(500).json({ error: 'Internal Server Error' });
          } else {
              res.json({ message: 'Booking created successfully.' });
          }
      });
  } catch (error) {
      console.error('Unexpected error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Fetch bookings
//http://localhost:4300/bookings?userId=4
app.get('/bookings', (req, res) => {
  const userId = req.query.userId;
  let query = 'SELECT b.bookingId, b.startdate, b.enddate, ' +
              'c.carId, c.Model, c.Color, c.DailyPrice, c.Description, c.image, c.localisation, ' +
              'u.userId, u.username ' +
              'FROM booking b, cars c, user u ' +
              'WHERE b.userId = u.userId AND b.carId = c.carId';

  if (userId) {
      query = 'SELECT bookingId, startdate, enddate, ' +
      'c.carId, Model, Color, DailyPrice, Description, image, localisation, ' +
      'u.userId, username  FROM booking b, cars c, user u WHERE b.userId = u.userId AND b.carId = c.carId and u.userId = ?';
      db.query(query, [userId], (err, results) => {
          if (err) {
              console.error('Error retrieving bookings:', err);
              res.status(500).json({ error: 'Internal Server Error' });
          } else {
              res.json(results);
          }
      });
  } else {
      db.query(query, (err, results) => {
          if (err) {
              console.error('Error retrieving bookings:', err);
              res.status(500).json({ error: 'Internal Server Error' });
          } else {
              res.json(results);
          }
      });
  }
});

app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});
