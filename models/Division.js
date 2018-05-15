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
  duo: {
    type: Boolean,
    default: false
  }
})

const Division = module.exports = mongoose.model('Division', DivisionSchema);

module.exports.getById = function(id, callback) {
  Division.findById(id, callback).populate({
    model: 'Team',
    path: 'teams',
    populate: {
      path: 'players',
      model: 'Player'
    }
  })
  .populate({
    model: 'Player',
    path: 'players'
  });
}

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

module.exports.create = function(newDivision, callback) {
  newDivision.save(callback);
}

module.exports.update = function(division, callback) {
  Division.findByIdAndUpdate(division._id, { $set: division }, { new: true }, callback);
}

module.exports.delete = function(id, callback) {
  Division.findByIdAndRemove(id, (err, division) => {
    if(err) callback(err, null);
    Match.remove({ division : id }, (err,removed) => {
      callback(err, removed);
   });
  });
}
