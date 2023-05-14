const express = require('express')
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');
const app = express();


app.use(bodyParser.json());



app.use(express.static('./public'))

app.use(session({
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }));

app.get('/', function(req, res) {
const user = req.session.user;
const role = req.session.role;

if (user && role==='maintenance') {
    res.sendFile(path.join(__dirname, '/views/maintenance/maintenancehome.html'));
    } else {
    res.sendFile(path.join(__dirname, '/views/index.html'));
    }
});

app.get('/announcements', function(req, res) {
  const user = req.session.user;
  const role = req.session.role;
  
  if (user && role==='maintenance') {
      res.sendFile(path.join(__dirname, '/views/maintenance/maintenanceann.html'));
      } else {
      res.sendFile(path.join(__dirname, '/views/index.html'));
      }
  });

app.get('/complaints', function(req, res) {
  const user = req.session.user;
  const role = req.session.role;
  
  if (user && role==='maintenance') {
      res.sendFile(path.join(__dirname, '/views/maintenance/maintenancecomplaints.html'));
      } else {
      res.sendFile(path.join(__dirname, '/views/index.html'));
      }
  });


  app.post('/resolution', (req, res) => {
    
    const { id } = req.body;
    console.log(id)
    const complaints = JSON.parse(fs.readFileSync('public/data/complaints.json'));

    complaints[id].resolved="true"
  
    fs.writeFileSync('public/data/complaints.json', JSON.stringify(complaints));

    console.log(`Resolved complaint with ID: ${id}`);

    res.status(200).json({ message: 'Complaint submitted successfully' });

    
  });


module.exports=app