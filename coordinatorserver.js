const express = require('express')
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');
const shortid = require('shortid');

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

if (user && role==='coordinator') {
    res.sendFile(path.join(__dirname, '/views/coordinator/coordinatorhome.html'));
    } else {
    res.sendFile(path.join(__dirname, '/views/index.html'));
    }
});

app.get('/announcements', function(req, res) {
  const user = req.session.user;
  const role = req.session.role;
  
  if (user && role==='coordinator') {
      res.sendFile(path.join(__dirname, '/views/coordinator/coorannouncements.html'));
      } else {
      res.sendFile(path.join(__dirname, '/views/index.html'));
      }
  });

app.get('/viewannouncements', function(req, res) {
  const user = req.session.user;
  const role = req.session.role;
  
  if (user && role==='coordinator') {
      res.sendFile(path.join(__dirname, '/views/coordinator/coorviewann.html'));
      } else {
      res.sendFile(path.join(__dirname, '/views/index.html'));
      }
  });

  app.get('/complaints', function(req, res) {
    const user = req.session.user;
    const role = req.session.role;
    
    if (user && role==='coordinator') {
        res.sendFile(path.join(__dirname, '/views/coordinator/coorcomplaints.html'));
        } else {
        res.sendFile(path.join(__dirname, '/views/index.html'));
        }
    });

app.post('/addannouncement', (req, res) => {
  // extract data from request body
  const { dig_id, name, date, ann_title, ann_type, ann_content } = req.body;

  // create JSON object from extracted data
  const announcement = {
    dig_id,
    name,
    date,
    ann_title,
    ann_type,
    ann_content
  };

  // read existing data from announcements.json
  const data = JSON.parse(fs.readFileSync('public/data/announcements.json', 'utf8'));

  const id = shortid.generate().substring(0, 4);
  while (data[id]) {
    id = shortid.generate().substring(0, 4);
  }

  // add new complaint to existing data with the unique ID as the key
  data['A'+id] = announcement;
  // write updated data to complaints.json
  fs.writeFileSync('public/data/announcements.json', JSON.stringify(data));

  // send response to client
  res.status(200).sendFile(path.join(__dirname, '/views/coordinator/announcementadded.html'));
});

  app.post('/addcomplaint', (req, res) => {
    // extract data from request body
    const { name, digitalid, type, subject, description } = req.body;
  
    // create JSON object from extracted data
    const complaint = {
      name,
      digitalid,
      type,
      subject,
      description,
      "resolved":false
    };
  
    // read existing data from complaints.json
    const data = JSON.parse(fs.readFileSync('public/data/complaints.json', 'utf8'));

    const id = shortid.generate().substring(0, 4);

    while (data[id]) {
      id = shortid.generate().substring(0, 4);
    }
  
    // add new complaint to existing data with the unique ID as the key
    data['C'+id] = complaint;
  
    // write updated data to complaints.json
    fs.writeFileSync('public/data/complaints.json', JSON.stringify(data));
  
    // send response to client
    res.status(200).sendFile(path.join(__dirname, '/views/coordinator/complaintadded.html'));
  });
  

module.exports=app