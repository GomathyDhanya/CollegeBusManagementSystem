const express = require('express')
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');

const app=express()

app.use(express.static('./public'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }));

const adminServer = require('./adminserver');
app.use('/admin', adminServer);

const passengerServer = require('./passengerserver');
app.use('/passenger', passengerServer);

const coordinatorServer = require('./coordinatorserver');
app.use('/coordinator', coordinatorServer);

const maintenanceServer = require('./maintenanceserver');
app.use('/maintenance', maintenanceServer);


app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, '/views/index.html'));
})

app.post('/', (req, res) => {
    // Retrieve user input from the request body
    const { email, password, role } = req.body;
  
    // Check if the user exists in the database
    // You would need to implement your own logic to check if the user exists in your database
    if (isValidUser(email, password, role)) {
      // Set a cookie to store the user's session data
      req.session.user = email;
      req.session.role = role;
  
      // Redirect to the home page
      if(role==='admin')
      res.redirect('/admin');
      else if(role==='passenger')
      res.redirect('/passenger');
      else if(role==='coordinator')
      res.redirect('/coordinator');
      else if(role==='maintenance')
      res.redirect('/maintenance');

    } 
  })



app.listen(8080,()=>{
    console.log('server is listening on 8080')
})

/*
function isValidUser(email, password, role) {
    return email === 'john@example.com' && password === 'password' && role === 'admin'
    ||email === 'john@example.com' && password === 'password' && role === 'passenger'
    ||email === 'john@example.com' && password === 'password' && role === 'coordinator'
    ||email === 'john@example.com' && password === 'password' && role === 'maintenance';
  }
*/

function isValidUser(email, password, role) {
    // read existing data from users.json
    const data = JSON.parse(fs.readFileSync('public/data/users.json', 'utf8'));

    // loop through the data to find a user that matches the email, password, and role
    for (const key in data) {
        const user = data[key];
        if (user.email === email && user.password === password && user.role === role) {
            return true;
        }
    }

    // no matching user found, return false
    return false;
}