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
  court_loc: {
    type: String
  },
  points: Number,
  won: Number,
  lost: Number,
  played: Number,
  points_won: Number,
  points_lost: Number,
  tc: String,
  tc_email: String,
  tc_phone: String,
  lsta_visa: String
})

const Team = module.exports = mongoose.model('Team', TeamSchema);

module.exports.getById = function(id, callback) {
  Team.findById(id, callback)
    .populate({
      model: 'Player',
      path: 'players'
    });
}

module.exports.getByLeagueId = function(id, callback) {
  Team.find({
    'league' : id
  }, callback);
}

module.exports.getAll = function(callback) {
  Team.find(callback);
}

module.exports.update = function(team, callback) {
  Team.findByIdAndUpdate(team._id, { $set: team }, { new: true }, callback);
}

module.exports.delete = function(id, callback) {
  Team.findByIdAndRemove(id, callback);
}

module.exports.create = function(newTeam, callback) {
  newTeam.save(callback);
}
