const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const TeamSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  }],
  league: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'League'
  },
  court_loc: String,
  tc: String,
  tc_email: String,
  tc_phone: String,
  lsta_visa: String
})

// !These are not saved to the database
// points: Number
// won: Number
// lost: Number
// played: Number
// points_won: Number
// points_lost: Number

const Team = module.exports = mongoose.model('Team', TeamSchema);
