const express = require('express');
const router = express.Router();
const async = require('async');

const Division = require('../models/Division');
const Match = require('../models/Match');
const auth = require('../middlewares/auth');

router.post('/', auth.isLogged, (req, res) => {
  let newDivision = new Division({
    ...req.body
  });
  Division.create(newDivision, (err, division) => {
    if (err) {
      res.json({
        success: false,
        message: err
      });
    } else {
      res.json({
        success: true,
        division: division
      });
    }
  })
});

router.get('/', (req, res) => {
  Division.getAll((err, divisions) => {
    if (err) res.json({
      success: false,
      message: err
    });
    res.json({
      success: true,
      all: divisions
    });
  })
});

router.put('/', auth.isLogged, (req, res) => {
  let updatedDivision = new Division({
    ...req.body
  });
  Division.update(updatedDivision, (err, division) => {
    if (err) {
      res.json({
        success: false,
        message: err
      });
    } else {
      res.json({
        success: true
      });
    }
  })
});

router.delete('/:id', auth.isLogged, (req, res) => {
  Division.delete(req.params.id, (err, division) => {
    if (err) {
      res.json({
        success: false,
        message: err
      });
    } else {
      res.json({
        success: true
      });
    }
  })
});

router.get('/:id', auth.isLogged, (req, res) => {
  Division.getById(req.params.id, (err, divisions) => {
    if (err) {
      res.json({
        success: false,
        message: err
      });
    } else {
      res.json({
        success: true,
        all: divisions
      });
    }
  })
});

function calcStats(team, division_id, callback) {
  team.points = 0;
  team.won = 0;
  team.lost = 0;
  team.played = 0;
  team.points_won = 0;
  team.points_lost = 0;
  Match.getAll((err, matches) => {
    if (err) {
      callback(err, null);
    }
    else {
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
            Match.calcScore(match, (updatedMatch) => {
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
  });
}

function calcTournamentStats(player, division_id, callback) {
  player.points_tournament = 0;
  player.won = 0;
  player.lost = 0;
  player.played = 0;
  player.points_won = 0;
  player.points_lost = 0;
  Match.getAll((err, matches) => {
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
            Match.calcScore(match, (updatedMatch) => {
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
        callback(err, team);
      });
    }
  });
}

processDivisions = (divisions, callback) => {
  async.each(divisions, (division, done) => {
    if (division.tournament) {
      async.each(division.players, (player, inner_done) => {
        calcTournamentStats(player, division._id, (err, result) => {
          if(result) {
            player = result;
          }
          inner_done();
        });
      }, err => {
        if(!err) done();
      });
    }
    else {
      async.each(division.teams, (team, inner_done) => {
        calcStats(team, division._id, (err, result) => {
          if(result) {
            team = result;
          }
          inner_done();
        });
      }, err => {
        if(!err) done();
      });
    }
  }, err => {
    if(!err) callback(divisions);
  });
}

router.get('/byleague/:id', (req, res) => {
  Division.getByLeagueId(req.params.id, (err, divisions) => {
    if (err) {
      res.json({
        success: false,
        message: err
      });
    } else {
      if (divisions.length === 0) {
        res.json({
          success: true,
          all: []
        });
      }
      else {
        processDivisions(divisions, divisions => {
          res.json({
            success: true,
            all: divisions
          });
        });
      }
    }
  })
});

module.exports = router;
