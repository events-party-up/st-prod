const mongoose = require('mongoose');

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
  brackets: [{
    size: {
      type: Number,
      default: 8
    },
    matches: [{
      position: Number,
      data: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match'
      }
    }]
  }]
});

module.exports = Tournament = mongoose.model('Tournament', TournamentSchema);