const mongoose = require('mongoose');

const TeamRegSchema = mongoose.Schema({
  team: String,
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  }],
  team_captain: String,
  league: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
});

const TeamReg = module.exports = mongoose.model('TeamReg', TeamRegSchema);
