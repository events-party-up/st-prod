const mongoose = require('mongoose')

var TournamentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  official: {
    type: Boolean,
    default: false
  },
  rate: {
    type: Number,
    default: 1
  },
  type: {
    type: String,
    default: 'solo'
  },
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  }],
  teams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  }],
  mode: {
    type: String,
    default: 'single'
  },
  divisions_included: {
    type: Boolean,
    default: false
  },
  split_size: {
    type: Number,
    default: 3
  },
  divisions: [mongoose.model('Division').schema],
  size: {
    type: Number,
    default: 16
  },
  brackets: [[{
    position: Number,
    data: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Match'
    }
  }]]
});

module.exports = Tournament = mongoose.model('Tournament', TournamentSchema);