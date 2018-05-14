const express = require('express');
const router = express.Router();
const Promise = require('bluebird');
const async = require('async');

const Player = require('../models/Player');
const Team = require('../models/Team');
const Match = require('../models/Match');
const auth = require('../middlewares/auth');
const config = require('../config');

// adds a new player to the database
router.post('/', auth.isLogged, (req, res) => {
  let player = new Player({
    ...req.body
  });
  Player.create(player, (err, pl) => {
    if (err) {
      res.json({
        success: false,
        message: err
      });
    }
    else {
      res.json({
        success: true,
        player: pl
      });
    }
  })
});

// returns all players from the database
router.get('/', (req, res) => {
  Player.getAll((err, players) => {
    if (err) res.json({
      success: false,
      message: err
    });
    res.json({
      success: true,
      players: players
    });
  })
});

router.get('/free', (req, res) => {
  Player.getFree((err, players) => {
    if (err) res.json({
      success: false,
      message: err
    });
    res.json({
      success: true,
      players: players
    });
  })
});

router.get('/ratings/calculate', auth.isLogged, (req, res) => {
  calcRatings(err => {
    if (err) {
      res.json({
        success: false,
        message: err
      });
    }
    else {
      res.json({
        success: true
      });
    }
  })
});

router.get('/fixbool', (req, res) => {
  let count = 0;
  Player.getAll((err, players) => {
    if (err) res.json({
      success: true
    });
    players.forEach(player => {
      Team.getAll((err, teams) => {
        if (err) res.json({
          success: true
        });
        let team_count = 0;
        teams.forEach(team => {
          tp_count = 0;
          team.players.forEach(item => {
            if (item._id === player._id) {
              player.inTeam = true;
              Player.update(player, (err, pl) => {
                if (err) res.json({
                  success: true
                });
              });
            }
            tp_count++;
            if (tp_count === team.players.length) {
              team_count++
            }
          })
          if (team_count === teams.length) {
            count++;
          }
        })
      })
      if (count === players) {
        res.json({
          success: true
        });
      }
    });
  })
});

// returns player by its ID
router.get('/:id', (req, res) => {
  Player.getById(req.params.id, (err, player) => {
    if (err) {
      res.json({
        success: false,
        message: err
      });
    }
    else {
      res.json({
        success: true,
        player: player
      });
    }
  });
});

function calcRatings(callback) {
  let players = [];
  Player.getAll((err, all) => {
    if (err) callback(err, null);
    players = [...all];
    players.forEach(player => {
      player.points = 0;
    })
    Match.getAll((err, matches) => {
      if (err) callback(err, null);
      async.eachSeries(matches, (match, match_done) => {
        let rate = match.division.league.rate || 1;
        if (match.division.league.tournament && !match.division.league.official) {
          return match_done();
        }
        async.eachOfSeries(match.pvp, (item, index, pvp_done) => {
          match.pvp[index].home.prev_rating = 0;
          match.pvp[index].away.prev_rating = 0;
          match.pvp[index].home.rating = 0;
          match.pvp[index].away.rating = 0;
          if (!item.home.player2 && !item.away.player2) {
            // Add null checking for player
            let home_player = players.findIndex(x => item.home ? (x._id.toString() === item.home.player._id.toString())
              : (match.home.player && x._id.toString() === match.home.player._id.toString()));
            let away_player = players.findIndex(x => item.away ? (x._id.toString() === item.away.player._id.toString())
              : (match.away.player && x._id.toString() === match.away.player._id.toString()));
            if (home_player != -1 && away_player != -1) {
              let total_points = option => players[option].initial_points + players[option].points;
              Match.whoWonPvp(item, (home, away, draw) => {
                  let WIN_SIDE = home ? 'home' : 'away';
                  let WIN_INDEX = home ? home_player : away_player;
                  let LOSE_INDEX = home ? away_player : home_player;
                  let LOSE_SIDE = home ? 'away' : 'home';
                  let isStronger = total_points(WIN_INDEX) > total_points(LOSE_INDEX);
                  let OPTION = isStronger ? 'STRONGER_DIFF' : 'WEAKER_DIFF';
                  let diff = isStronger ? total_points(WIN_INDEX) - total_points(LOSE_INDEX) 
                    : total_points(LOSE_INDEX) - total_points(WIN_INDEX);

                  config[OPTION].forEach(result => {
                    if (result.max >= diff && result.min <= diff) {
                      match.pvp[index][WIN_SIDE].prev_rating = players[WIN_INDEX].initial_points + players[WIN_INDEX].points;
                      match.pvp[index][LOSE_SIDE].prev_rating = players[LOSE_INDEX].initial_points + players[LOSE_INDEX].points;

                      if(!item.home.player.foreigner && !item.away.player.foreigner) {
                        players[WIN_INDEX].points += result.win_points * rate;
                        players[LOSE_INDEX].points -= result.lost_points * rate;
                      }
                  
                      match.pvp[index][WIN_SIDE].rating = players[WIN_INDEX].initial_points + players[WIN_INDEX].points;
                      match.pvp[index][LOSE_SIDE].rating = players[LOSE_INDEX].initial_points + players[LOSE_INDEX].points;
                    }
                  });
              });
            }
          } 
          pvp_done();                 
        }, err => {
          if(!err) match_done();
          else match_done(err);
        });
      }, err => {
        if(err) callback(err, null);
        let done = false;
        async.each(matches, (match, done) => {
          Match.update(match, (err, result) => {
            if (err) callback(err, null);
            done();
          });
        }, err => {
          if (err) callback(err, null);
          if(done) return callback();
          done = true;
        });
        async.each(players, (player, done) => {
          Player.update(player, (err, pl) => {
            if (err) callback(err, null);
            done();
          });
        }, err => {
          if (err) callback(err, null);
          if(done) return callback();
          done = true;
        });
      });
    })
  });
}

// updates existing player data
router.put('/', auth.isLogged, (req, res) => {
  let player = new Player({
    ...req.body
  });
  Player.update(player, (err, pl) => {
    if (err) res.json({
      success: false,
      message: err
    });
    res.json({
      success: true
    });
  });
});

// removes player from the database by its ID
router.delete('/:id', auth.isLogged, (req, res) => {
  Player.delete(req.params.id, (err) => {
    if (err) res.json({
      success: false,
      message: err
    });
    res.json({
      success: true
    });
  });
});

module.exports = router;
