require('dotenv').config();
const express = require('express');
const massive = require('massive');
const session = require('express-session'); 
const authCtrl = require('./controllers/authController'); 
const treasureCtrl = require('./controllers/treasureController'); 
const auth = require('./middleware/authMiddleware'); 


// ENV Variable
const {
    SERVER_PORT,
    CONNECTION_STRING, 
    SESSION_SECRET 
} = process.env; 

// App Instance 
const app = express(); 

// Database Connection 
massive(CONNECTION_STRING)
    .then(dbInstance => {
        app.set('db', dbInstance);
        console.log('Database is running')
    }); 

//TLM 
app.use(express.json()); 
app.use(session({
    resave: true, 
    saveUninitialized: false, 
    secret: SESSION_SECRET, 
}));

// Endpoint 
app.post('/auth/register', authCtrl.register);
app.post('/auth/login', authCtrl.login); 
app.get('/auth/logout', authCtrl.logout);

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure);
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure);
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure);
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly,treasureCtrl.getAllTreasure);

// App Listening 
app.listen(SERVER_PORT, () => console.log(`Server is running on port ${SERVER_PORT}`)); 
