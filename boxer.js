'use strict';
const mongoose = require('mongoose');

const boxerSchema = new mongoose.Schema({
  name: String,
  division: String,
  belt: String
});

module.exports = mongoose.model('Boxer', boxerSchema);
