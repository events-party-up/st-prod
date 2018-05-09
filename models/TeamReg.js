const mongoose = require('mongoose');

const TeamRegSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  players: [{
    first_name: {
      type: String,
      required: true
    },
      last_name: {
      type: String,
      required: true
    }
  }],
  team_captain: {
    first_name: {
      type: String,
      required: true
    },
    last_name: {
      type: String,
      required: true
    }
  },
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

module.exports.getById = function(id, callback) {
  TeamReg.findById(id, callback);
}

module.exports.getAll = function(callback) {
  TeamReg.find(callback);
}

module.exports.create = function(newTeamReg, callback) {
  newTeamReg.save(callback);
}

module.exports.delete = function(id, callback) {
  TeamReg.findByIdAndRemove(id, callback);
}

module.exports.update = function(teamReg, callback) {
  TeamReg.findByIdAndUpdate(teamReg._id, { $set: teamReg }, { new: true }, callback);
}
