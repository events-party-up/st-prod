const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Division = require('./Division');
const Match = require('./Match');

const LeagueSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  tournament: {
    type: Boolean,
    default: false
  },
  official: {
    type: Boolean,
    default: false
  }
})

const League = module.exports = mongoose.model('League', LeagueSchema);

module.exports.getById = function(id, callback) {
  League.findById(id, callback);
}

module.exports.getAll = function(tournament, callback) {
  League.find({tournament: tournament},callback);
}

module.exports.create = function(newLeague, callback) {
  newLeague.save(callback);
}

module.exports.update = function(league, callback) {
  League.findByIdAndUpdate(league._id, { $set: league }, { new: true }, callback);
}

module.exports.delete = function(id, callback) {
  League.findByIdAndRemove(id, (err, league) => {
    if(err) callback(err, null);
  });
  Division.getByLeagueId(id, (err, divisions) => {
    if(err) callback(err, null);
    divisions.forEach(division => {
      Division.delete(division._id, callback);
    })
  })
}
