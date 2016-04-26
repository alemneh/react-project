'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const Boxer = require('./models/boxer');
const mongoose = require('mongoose');
process.MONGO_URI = 'mongodb://localhost/P4P';
mongoose.connect(process.MONGO_URI);

app.use('/', express.static(__dirname+ '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req, res, next) {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

app.get('/api/boxers', function(req, res) {
  Boxer.find({}, (err, data) => {
    if(err) throw err;
    res.json(data);
  });
});

app.post('/api/boxers', function(req, res) {
  var newBoxer = new Boxer(req.body);
  newBoxer.save((err) => {
    if(err) throw err;
    res.send('Saved!');
  });

});

app.delete('/api/boxers/:name', function(req, res) {
  Boxer.findOneAndRemove({name: req.params.name}, (err) => {
    if(err) throw err;
    res.json({data: 'Deleted'});
  });
});

app.put('/api/boxers/:name', function(req, res) {
  console.log(req.body);
  Boxer.findOneAndUpdate({name: req.params.name}, req.body, (err, data) => {
    if(err) throw err;
    console.log(data);
    res.send('Updated!');
  });
});

app.listen(3000, () => { console.log('Up on port 3000');});
