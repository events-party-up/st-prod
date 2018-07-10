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
  },
  rate: {
    type: Number,
    default: 1
  },
  gender: {
    type: String,
    required: true
  },
  rules_url: {
    type: String
  },
  season: {
    type: Number,
    required: true
  }
})

const League = module.exports = mongoose.model('League', LeagueSchema);

module.exports.getById = function(id, callback) {
  League.findById(id, callback);
}

module.exports.getAll = function(options, callback) {
  League.find(options,callback);
}

// module.exports.update = function(league, callback) {
//   League.findByIdAndUpdate(league._id, { $set: league }, { new: true }, callback);
// }

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
