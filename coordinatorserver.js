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

  app.post('/addannouncement', (req, res) => {
    
    const { busno, subject, description } = req.body;
  
    let ts = Date.now();

    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();

    d=year + "-" + month + "-" + date

    const announcement = {
      "title":subject,
      "date":d,
      "BusId":busno,
      "description":description,
    };

  
    const data = JSON.parse(fs.readFileSync('public/data/announcements.json', 'utf8'));

    const id = shortid.generate().substring(0, 4);

    while (data[id]) {
      id = shortid.generate().substring(0, 4);
    }
  
    data['A'+id] = announcement;
  
    fs.writeFileSync('public/data/announcements.json', JSON.stringify(data));
  
    res.status(200).sendFile(path.join(__dirname, '/views/coordinator/announcementadded.html'));
  });
  

module.exports=app