const express = require('express')
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();


app.use(express.static('./public'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }));

app.get('/', function(req, res) {
const user = req.session.user;
const role = req.session.role;

if (user && role==='passenger') {
    res.sendFile(path.join(__dirname, '/views/passenger/passengerhome.html'));
    } else {
    res.sendFile(path.join(__dirname, '/views/index.html'));
    }
});

app.get('/announcements', function(req, res) {
  const user = req.session.user;
  const role = req.session.role;
  
  if (user && role==='passenger') {
      res.sendFile(path.join(__dirname, '/views/passenger/pannounce.html'));
      } else {
      res.sendFile(path.join(__dirname, '/views/index.html'));
      }
  });

  app.get('/complaints', function(req, res) {
    const user = req.session.user;
    const role = req.session.role;
    
    if (user && role==='passenger') {
        res.sendFile(path.join(__dirname, '/views/passenger/pcomplaints.html'));
        } else {
        res.sendFile(path.join(__dirname, '/views/index.html'));
        }
    });

module.exports=app