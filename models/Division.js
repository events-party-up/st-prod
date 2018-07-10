const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Match = require('./Match');

const DivisionSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  stage: {
    type: String,
    required: true
  },
  teams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  }],
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  }],
  prev_points: [{
    id: String,
    points: {
      type: Number,
      default: 0
    }
  }],
  show_pp: {
    type: Boolean,
    default: false
  },
  league: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'League'
  },
  type: {
    type: String,
    required: true
  },
  tournament: {
    type: Boolean,
    default: false
  },
  season: {
    type: Number,
    required: true
  }
})

const Division = module.exports = mongoose.model('Division', DivisionSchema);

module.exports.getByLeagueId = function(id, callback) {
  Division.find({
    'league' : id
  }, callback)
  .populate({
    model: 'League',
    path: 'league'
  })
  .populate({
    model: 'Team',
    path: 'teams'
  })
  .populate({
    model: 'Player',
    path: 'players'
  });
}

module.exports.getAll = function(callback) {
  Division.find(callback)
  .populate({
    model: 'League',
    path: 'league'
  })
  .populate({
    model: 'Player',
    path: 'players'
  });
}

