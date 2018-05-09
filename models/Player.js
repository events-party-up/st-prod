const mongoose = require('mongoose');

const PlayerSchema = mongoose.Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  initial_points: {
    type: Number,
    required: true
  },
  points: {
    type: Number,
    required: false,
    default: 0
  },
  location: {
    type: String,
  },
  points_tournament: Number,
  won: Number,
  lost: Number,
  played: Number,
  points_won: Number,
  points_lost: Number,
  foreigner: {
    type: Boolean,
    default: false
  },
  birthday: {
    type: String,
  },
  gender: {
    type: String,
    required: true
  },
  inTeam: {
    type: Boolean,
    default: false
  }
});

const Player = module.exports = mongoose.model('Player', PlayerSchema);

module.exports.getById = function(id, callback) {
  Player.findById(id, callback);
}

module.exports.getAll = function(callback) {
  Player.find(callback);
}

module.exports.getFree = function(callback) {
  Player.find({ "inTeam": false }, callback);
}

module.exports.create = function(newPlayer, callback) {
  newPlayer.save(callback);
}

module.exports.delete = function(id, callback) {
  Player.findByIdAndRemove(id, callback);
}

module.exports.update = function(player, callback) {
  Player.findByIdAndUpdate(player._id, { $set: player }, { new: true }, callback);
}
