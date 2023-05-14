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

if (user && role==='admin') {
    res.sendFile(path.join(__dirname, '/views/admin/adminhome.html'));
    } else {
    res.sendFile(path.join(__dirname, '/views/index.html'));
    }
});

app.get('/announcements', function(req, res) {
  const user = req.session.user;
  const role = req.session.role;
  
  if (user && role==='admin') {
      res.sendFile(path.join(__dirname, '/views/admin/aannounce.html'));
      } else {
      res.sendFile(path.join(__dirname, '/views/index.html'));
      }
  });

app.get('/viewannouncements', function(req, res) {
  const user = req.session.user;
  const role = req.session.role;
  
  if (user && role==='admin') {
      res.sendFile(path.join(__dirname, '/views/admin/aviewann.html'));
      } else {
      res.sendFile(path.join(__dirname, '/views/index.html'));
      }
  });

app.get('/complaints', function(req, res) {
  const user = req.session.user;
  const role = req.session.role;
  
  if (user && role==='admin') {
      res.sendFile(path.join(__dirname, '/views/admin/acomplaints.html'));
      } else {
      res.sendFile(path.join(__dirname, '/views/index.html'));
      }
  });

app.get('/viewcomplaints', function(req, res) {
  const user = req.session.user;
  const role = req.session.role;
  
  if (user && role==='admin') {
      res.sendFile(path.join(__dirname, '/views/admin/aviewcomp.html'));
      } else {
      res.sendFile(path.join(__dirname, '/views/index.html'));
      }
  });

app.get('/adduser', function(req, res) {
  const user = req.session.user;
  const role = req.session.role;
  
  if (user && role==='admin') {
      res.sendFile(path.join(__dirname, '/views/admin/adduser.html'));
      } else {
      res.sendFile(path.join(__dirname, '/views/index.html'));
      }
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
  res.status(200).sendFile(path.join(__dirname, '/views/admin/complaintadded.html'));
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
  res.status(200).sendFile(path.join(__dirname, '/views/admin/annadded.html'));
});

app.post('/adduser', (req, res) => {
  // extract data from request body
  const { digitalid, name, role, email, password } = req.body;

  // create JSON object from extracted data
  const user = {
    digitalid,
    name,
    role,
    email,
    password
  };

  // read existing data from users.json
  const data = JSON.parse(fs.readFileSync('public/data/users.json', 'utf8'));
  // add new complaint to existing data with the unique ID as the key
  data[digitalid] = user;
  // write updated data to complaints.json
  fs.writeFileSync('public/data/users.json', JSON.stringify(data));

  // send response to client
  res.status(200).sendFile(path.join(__dirname, '/views/admin/useradded.html'));
});

app.post('/addnewbus', (req, res) => {
  // extract data from request body
  const bus_no = req.body.bus_no;
  const times = req.body.time;
  const stops = req.body.loc;

  // create list of objects from extracted data
  const route = times.map((time, index) => ({time, busstop: stops[index]}));

  // sort the route by time in ascending order
  route.sort((a, b) => (a.time > b.time) ? 1 : -1);

  // read existing data from buses.json
  const data = JSON.parse(fs.readFileSync('public/data/buses.json', 'utf8'));

  // add new bus route to existing data with the unique ID as the key
  data['B'+bus_no] = {route};
  
  // sort the keys of the data object
  const sortedData = {};
  Object.keys(data).sort().forEach(function(key) {
    sortedData[key] = data[key];
  });

  // write updated data to buses.json
  fs.writeFileSync('public/data/buses.json', JSON.stringify(sortedData));

  // send response to client on saving, reload page
  res.status(200).sendFile(path.join(__dirname, '/views/admin/adminhome.html'));
});

app.delete('/deletebus/:busId', (req, res) => {
  const busId = req.params.busId;

  // read existing data from buses.json
  const data = JSON.parse(fs.readFileSync('public/data/buses.json', 'utf8'));
  // delete the bus with the given busId from the data object
  delete data[busId];

  // write updated data to buses.json
  fs.writeFileSync('public/data/buses.json', JSON.stringify(data));

  // send response to client on successful deletion and reload page
  res.status(200).sendFile(path.join(__dirname, '/views/admin/adminhome.html'));
});

app.delete('/deletewaypoint/:busId/:busStop', (req, res) => {
  const busId = req.params.busId;
  const busStop = req.params.busStop;

  // read existing data from buses.json
  const data = JSON.parse(fs.readFileSync('public/data/buses.json', 'utf8'));

  // Find the bus object with the given busId
  const bus = data[busId];

  // Find the route array within that bus object
  const route = bus.route;

  // Find the index of the route object that has the given busStop
  const index = route.findIndex((item) => item.busstop === busStop);

  // Remove that route object from the route array
  if (index !== -1) {
    route.splice(index, 1);
  }

  // write updated data to buses.json
  fs.writeFileSync('public/data/buses.json', JSON.stringify(data));
  
  // send response to client on successful deletion and reload page
  res.status(200).sendFile(path.join(__dirname, '/views/admin/adminhome.html'));
});

app.delete('/insertwaypoint/:busId/:time/:busStop', (req, res) => {
  const busId = req.params.busId;
  const time = req.params.time;
  const busStop = req.params.busStop;

  // read existing data from buses.json
  const data = JSON.parse(fs.readFileSync('public/data/buses.json', 'utf8'));

  // Find the bus object with the given busId
  const bus = data[busId];

  // Find the route array within that bus object
  const route = bus.route;

  // Append new waypoint to the route list
  route.push({"time": time, "busstop": busStop});
  
  // sort the route by time in ascending order
  route.sort((a, b) => (a.time > b.time) ? 1 : -1);

  // write updated data to buses.json
  fs.writeFileSync('public/data/buses.json', JSON.stringify(data));
  
  // send response to client on successful deletion and reload page
  res.status(200).sendFile(path.join(__dirname, '/views/admin/adminhome.html'));
});


module.exports=app