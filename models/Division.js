const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const model = require('../models');
const Match = require('./Match');

const DivisionSchema = mongoose.Schema({
  name: String,
  stage: String,
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
  season: {
    type: Number
  }
})

const Division = module.exports = mongoose.model('Division', DivisionSchema);

module.exports.getByLeagueId = function (id, callback) {
  Division.find({
    'league': id
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

module.exports.getAll = function (callback) {
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

module.exports.calcStats = function (item, matches, division_id, callback) {
  let team = JSON.parse(JSON.stringify(item));
  team.points = 0;
  team.won = 0;
  team.lost = 0;
  team.played = 0;
  team.points_won = 0;
  team.points_lost = 0;
  async.each(matches, (match, done) => {
    if (division_id.toString() === match.division._id.toString() && (match.home.team._id.toString() === team._id.toString() || match.away.team._id.toString() === team._id.toString())) {
      if (match.absent && match.absent !== '-1') {
        if (match.home.team._id.toString() === team._id.toString() && match.away.team._id.toString() === match.absent) {
          team.won++;
          team.points += 2;
        }
        else if (match.away.team._id.toString() === team._id.toString() && match.home.team._id.toString() === match.absent) {
          team.won++;
          team.points += 2;
        }
        else {
          team.lost++;
          team.points++;
        }
      }
      else {
        model.Match.calcScore(match, (updatedMatch) => {
          if (match.finished) {
            team.played++;
            if ((updatedMatch.home.team._id.toString() === team._id.toString()) && updatedMatch.home.score > updatedMatch.away.score) {
              team.won++;
              team.points += 2;
            }
            else if ((updatedMatch.away.team._id.toString() === team._id.toString()) && updatedMatch.away.score > updatedMatch.home.score) {
              team.won++;
              team.points += 2;
            }
            else {
              team.lost++;
              team.points++;
            }
            if (updatedMatch.home.team._id.toString() === team._id.toString()) {
              team.points_lost += updatedMatch.away.score;
              team.points_won += updatedMatch.home.score;
            }
            else if (updatedMatch.away.team._id.toString() === team._id.toString()) {
              team.points_lost += updatedMatch.home.score;
              team.points_won += updatedMatch.away.score;
            }
          }
        });
      }
    }
    done();
  }, err => {
    callback(err, team);
  });
}

module.exports.calcTournamentStats = function (item, division_id, callback) {
  let player = JSON.parse(JSON.stringify(item));
  player.points_tournament = 0;
  player.won = 0;
  player.lost = 0;
  player.played = 0;
  player.points_won = 0;
  player.points_lost = 0;
  model.Match.getAll((err, matches) => {
    if (err) {
      callback(err);
    }
    else {
      async.each(matches, (match, done) => {
        if (division_id.toString() === match.division._id.toString() && (match.home.player.toString() === player._id.toString() || match.away.player.toString() === player._id.toString())) {
          if (match.absent && match.absent !== '-1') {
            if (match.home.player.toString() === player._id.toString() && match.away.player.toString() === match.absent) {
              player.won++;
              player.points += 2;
            }
            else if (match.away.player.toString() === player._id.toString() && match.home.player.toString() === match.absent) {
              player.won++;
              player.points += 2;
            }
            else {
              player.lost++;
              player.points++;
            }
          }
          else {
            model.Match.calcScore(match, (updatedMatch) => {
              if (match.finished) {
                player.played++;
                if ((updatedMatch.home.player.toString() === player._id.toString()) && updatedMatch.home.score > updatedMatch.away.score) {
                  player.won++;
                  player.points_tournament += 2;
                }
                else if ((updatedMatch.away.player.toString() === player._id.toString()) && updatedMatch.away.score > updatedMatch.home.score) {
                  player.won++;
                  player.points_tournament += 2;
                }
                else {
                  player.lost++;
                  player.points_tournament++;
                }
                if (updatedMatch.home.player.toString() === player._id.toString()) {
                  player.points_lost += updatedMatch.away.score;
                  player.points_won += updatedMatch.home.score;
                }
                else if (updatedMatch.away.player.toString() === player._id.toString()) {
                  player.points_lost += updatedMatch.home.score;
                  player.points_won += updatedMatch.away.score;
                }
              }
            })
          }
        }
        done();
      }, err => {
        callback(err, player);
      });
    }
  });
}

module.exports.processDivisions = function (divisions, callback) {
  async.eachOfSeries(divisions, (division, key, done) => {
    if (division.players) {
      async.eachOfSeries(division.players, (player, index, inner_done) => {
        calcTournamentStats(player, division._id, (err, result) => {
          if (result) {
            divisions[key].players[index] = result;
          }
          inner_done();
        });
      }, err => {
        if (!err) done();
      });
    }
    else {
      model.Match.getByDivisionId(division._id, (err, matches) => {
        if (err) {
          callback(err, null);
        }
        else {
          async.eachOfSeries(division.teams, (team, index, inner_done) => {
            calcStats(team, matches, division._id, (err, result) => {
              if (result) {
                divisions[key].teams[index] = result;
              }
              inner_done();
            });
          }, err => {
            if (!err) done();
          });
        }
      });
    }
  }, err => {
    if (!err) callback(divisions);
  });
}

