const express = require('express');
const router = express.Router();
const Promise = require('bluebird');

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
  calcRatings((err, updated) => {
    if (err) {
      res.json({
        success: false,
        message: err
      });
    }
    else {
      res.json({
        success: true,
        updated: updated
      });
    }
  })
});

router.get('/fixbool', (req, res) => {
  let count = 0;
  Player.getAll((err, players) => {
    if(err) res.json({
        success: true
      });
    players.forEach(player => {
      Team.getAll((err, teams) => {
        if(err) res.json({
          success: true
        });
        let team_count = 0;
        teams.forEach(team => {
          tp_count = 0;
          team.players.forEach(item => {
            if (item._id === player._id) {
              player.inTeam = true;
              Player.update(player, (err, pl) => {
                if(err) res.json({
                  success: true
                });
              });
            }
            tp_count++;
            if(tp_count === team.players.length) {
              team_count++
            }
          })
          if(team_count === teams.length){
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
      let matchesProcessed = 0;
      matches.forEach(match => {
        let rate = 1;
        if (match.division.league.rate) rate = match.division.league.rate;
        match.pvp.forEach((item, index) => {
          let home_player = players.findIndex(x => item.home ? (x._id.toString() === item.home.player.toString())
            : (match.home.player && x._id.toString() === match.home.player.toString()));
          let away_player = players.findIndex(x => item.away ? (x._id.toString() === item.away.player.toString())
            : (match.away.player && x._id.toString() === match.away.player.toString()));
          if (home_player != -1 && away_player != -1
            && !home_player.foreigner
            && !away_player.foreginer) {
            if (match.division.league.tournament && !match.division.league.official) {
              return;
            }
            let hp_fp = players[home_player].initial_points + players[home_player].points;
            let ap_fp = players[away_player].initial_points + players[away_player].points;
            Match.whoWonPvp(item, (home, away) => {
              if (home) {
                if (hp_fp > ap_fp) {
                  let diff = hp_fp - ap_fp;
                  console.log(diff);
                  config.STRONGER_DIFF.forEach(option => {
                    if (option.max >= diff && option.min <= diff) {
                      players[home_player].points += option.win_points * rate;
                      players[away_player].points -= option.lost_points * rate;
                      match.pvp[index].home.rating += option.win_points * rate;
                      match.pvp[index].away.rating -= option.lost_points * rate;
                    }
                  });
                }
                else {
                  let diff = ap_fp - hp_fp;
                  config.WEAKER_DIFF.forEach(option => {
                    if (option.max >= diff && option.min <= diff) {
                      players[home_player].points += option.win_points * rate;
                      players[away_player].points -= option.lost_points * rate;
                      match.pvp[index].home.rating += option.win_points * rate;
                      match.pvp[index].away.rating -= option.lost_points * rate;
                    }
                  });
                }
              }
              else {
                if (ap_fp > hp_fp) {
                  let diff = ap_fp - hp_fp;
                  config.STRONGER_DIFF.forEach(option => {
                    if (option.max >= diff && option.min <= diff) {
                      players[away_player].points += option.win_points * rate;
                      players[home_player].points -= option.lost_points * rate;
                      match.pvp[index].away.rating += option.win_points * rate;
                      match.pvp[index].home.rating -= option.lost_points * rate;
                    }
                  });
                }
                else {
                  let diff = hp_fp - ap_fp;
                  config.WEAKER_DIFF.forEach(option => {
                    if (option.max >= diff && option.min <= diff) {
                      players[away_player].points += option.win_points * rate;
                      players[home_player].points -= option.lost_points * rate;
                      match.pvp[index].away.rating += option.win_points * rate;
                      match.pvp[index].home.rating -= option.lost_points * rate;
                    }
                  });
                }
              }
            });
          }
        });
        console.log(match.pvp);
        matchesProcessed++;
      });
      if (matchesProcessed === matches.length) {
        let update_count = 0,
          updated = 0;
        matches.forEach(match => {
          update_count++;
          Match.update(match, (err, result) => {
            // console.log(match.pvp);
            if (err) {
              callback(err, null);
            }
            else {
              updated++;
            }
          });
        });
        players.forEach(player => {
          update_count++;
          Player.update(player, (err, pl) => {
            if (err) {
              callback(err, null);
            }
            else {
              updated++;
            }
          });
        });
        if (update_count === players.length + matches.length) {
          callback(null, updated)
        }
      }
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
