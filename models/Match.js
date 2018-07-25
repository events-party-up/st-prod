const mongoose = require('mongoose');

const MatchSchema = mongoose.Schema({
  division: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Division'
  },
  tournament_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  home: {
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team'
    },
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player'
    },
    score: Number
  },
  away: {
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team'
    },
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player'
    },
    score: Number
  },
  pvp: [
    {
      home: {
        player: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Player'
        },
        player2: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Player'
        },
        rating: {
          type: Number,
          default: 0
        },
        prev_rating: {
          type: Number,
          default: 0
        }
      },
      away: {
        player: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Player'
        },
        player2: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Player'
        },
        rating: {
          type: Number,
          default: 0
        },
        prev_rating: {
          type: Number,
          default: 0
        }
      },
      score: String
    }
  ],
  date: Date,
  finished: false,
  absent: String,
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location'
  }
})

let autoPopulate = function (next) {
  this.populate([
    {
      path: 'players',
    },
    {
      path: 'teams',
      populate: {
        path: 'players',
      }
    },
    {
      path: 'brackets.matches.data',
      populate: {
        path: 'home.player away.player'
      },
      populate: {
        path: 'pvp.home.player pvp.away.player pvp.home.player2 pvp.away.player2',
      },
      populate: {
        path: 'away.team home.team ',
        populate: {
          path: 'players',
        },
      },
    }])
  next();
};

MatchSchema.pre('findByIdAndUpdate', autoPopulate)
MatchSchema.pre('findById', autoPopulate)

const Match = module.exports = mongoose.model('Match', MatchSchema);

module.exports.getById = function (id, callback) {
  Match.findById(id, callback)
    .populate({
      model: 'Player',
      path: 'pvp.home.player',
    })
    .populate({
      model: 'Player',
      path: 'pvp.away.player',
    })
    .populate({
      model: 'Player',
      path: 'pvp.home.player2',
    })
    .populate({
      model: 'Player',
      path: 'pvp.away.player2',
    })
    .populate({//done
      model: 'Division',
      path: 'division',
      populate: {
        path: 'league',
        model: 'League'
      }
    })
    .populate({
      model: 'Team',
      path: 'home.team'
    })
    .populate({
      model: 'Team',
      path: 'away.team'
    })
    .populate({
      model: 'Player',
      path: 'home.player'
    })
    .populate({
      model: 'Player',
      path: 'away.player'
    });
}

module.exports.getByDivisionIds = function (ids, callback) {
  Match.find({ division: { "$in": ids } }, callback)
    .populate({
      model: 'Division',
      path: 'division',
      populate: {
        path: 'league',
        model: 'League'
      }
    })
    .populate({
      model: 'Team',
      path: 'home.team',
      populate: {
        path: 'players',
        model: 'Player'
      }
    })
    .populate({
      model: 'Team',
      path: 'away.team',
      populate: {
        path: 'players',
        model: 'Player'
      }
    })
    .populate({
      model: 'Player',
      path: 'home.player'
    })
    .populate({
      model: 'Player',
      path: 'away.player'
    });
}

module.exports.getByTeamId = function (id, callback) {
  Match.find({ $or: [{ "home.team": id }, { "away.team": id }] }, callback)
    .populate({
      model: 'Player',
      path: 'pvp.home.player',
    })
    .populate({
      model: 'Player',
      path: 'pvp.away.player',
    })
    .populate({
      model: 'Player',
      path: 'pvp.home.player2',
    })
    .populate({
      model: 'Player',
      path: 'pvp.away.player2',
    })
    .populate({
      model: 'Team',
      path: 'home.team',
    })
    .populate({
      model: 'Team',
      path: 'away.team',
    })
    .populate({
      model: 'Division',
      path: 'division',
      populate: {
        path: 'league',
        model: 'League'
      }
    })
}

module.exports.getByPlayerId = function (id, callback) {
  Match.find({ $or: [{ "pvp.home.player": id }, { "pvp.away.player": id }, { "home.player": id }, { "away.player": id }] }, callback)
    .populate({
      model: 'Player',
      path: 'pvp.home.player',
    })
    .populate({
      model: 'Player',
      path: 'pvp.away.player',
    })
    .populate({
      model: 'Player',
      path: 'pvp.home.player2',
    })
    .populate({
      model: 'Player',
      path: 'pvp.away.player2',
    })
    .populate({
      model: 'Division',
      path: 'division',
      populate: {
        path: 'league',
        model: 'League'
      }
    })
    .populate({
      model: 'Team',
      path: 'home.team'
    })
    .populate({
      model: 'Team',
      path: 'away.team'
    })
    .populate({
      model: 'Player',
      path: 'home.player'
    })
    .populate({
      model: 'Player',
      path: 'away.player'
    });
}


module.exports.getByDivisionId = function (id, callback) {
  Match.find({
    'division': mongoose.Types.ObjectId(id)
  }, callback)
    .sort({ date: 1 })
    .populate({
      model: 'Division',
      path: 'division',
      populate: {
        path: 'league',
        model: 'League'
      }
    })
    .populate({
      model: 'Team',
      path: 'home.team',
      populate: {
        path: 'players',
        model: 'Player'
      }
    })
    .populate({
      model: 'Team',
      path: 'away.team',
      populate: {
        path: 'players',
        model: 'Player'
      }
    })
    .populate({
      model: 'Player',
      path: 'home.player'
    })
    .populate({
      model: 'Player',
      path: 'away.player'
    })
    .populate({
      model: 'Location',
      path: 'location'
    });

}

module.exports.getAll = function (callback) {
  Match.find(callback)
    .sort({ date: 1 })
    .populate({
      model: 'Player',
      path: 'pvp.home.player',
    })
    .populate({
      model: 'Player',
      path: 'pvp.away.player',
    })
    .populate({
      model: 'Player',
      path: 'pvp.home.player2',
    })
    .populate({
      model: 'Player',
      path: 'pvp.away.player2',
    })
    .populate({
      model: 'Division',
      path: 'division',
      populate: {
        path: 'league',
        model: 'League'
      }
    })
    .populate({
      model: 'Team',
      path: 'home.team'
    })
    .populate({
      model: 'Team',
      path: 'away.team'
    })
    .populate({
      model: 'Player',
      path: 'home.player'
    })
    .populate({
      model: 'Player',
      path: 'away.player'
    });
}

module.exports.update = function (match, callback) {
  Match.findByIdAndUpdate(match._id, { $set: match }, { new: true }, callback);
}

module.exports.delete = function (id, callback) {
  Match.findByIdAndRemove(id, callback);
}

module.exports.whoWonPvp = function (item, callback) {
  let result = item.score.split(' ');
  let home_round = 0, away_round = 0;
  result.forEach(item => {
    let parse = item.split('-');
    if (parseInt(parse[0]) > parseInt(parse[1])) home_round++;
    else if (parseInt(parse[0]) < parseInt(parse[1])) away_round++;
  });
  if (home_round === 0 && away_round === 0) callback(false, false, true);
  else callback((home_round > away_round), home_round < away_round);
}

module.exports.calcScore = function (match, callback) {
  let homeTeam_points = 0, awayTeam_points = 0;
  match.pvp.forEach(item => {
    let home_round = 0, away_round = 0;
    Match.whoWonPvp(item, (home, away, draw) => {
      if (home) homeTeam_points++;
      else if (away) awayTeam_points++;
    });
  });
  match.home.score = homeTeam_points;
  match.away.score = awayTeam_points;
  callback(match);
}
