const express = require('express');
const router = express.Router();

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
      callback(err);
    }
    else {
      matches.forEach(match => {
        if (division_id.toString() === match.division._id.toString() && (match.home.team.toString() === team._id.toString() || match.away.team.toString() === team._id.toString())) {
          if (match.absent && match.absent !== '-1') {
            if (match.home.team.toString() === team._id.toString() && match.away.team.toString() === match.absent) {
              team.won++;
              team.points += 2;
            }
            else if (match.away.team.toString() === team._id.toString() && match.home.team.toString() === match.absent) {
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
                if ((updatedMatch.home.team.toString() === team._id.toString()) && updatedMatch.home.score > updatedMatch.away.score) {
                  team.won++;
                  team.points += 2;
                }
                else if ((updatedMatch.away.team.toString() === team._id.toString()) && updatedMatch.away.score > updatedMatch.home.score) {
                  team.won++;
                  team.points += 2;
                }
                else {
                  team.lost++;
                  team.points++;
                }
                if (updatedMatch.home.team.toString() === team._id.toString()) {
                  team.points_lost += updatedMatch.away.score;
                  team.points_won += updatedMatch.home.score;
                }
                else if (updatedMatch.away.team.toString() === team._id.toString()) {
                  team.points_lost += updatedMatch.home.score;
                  team.points_won += updatedMatch.away.score;
                }
              }
            })
          }
        }
      });
      callback(err, team);
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
      matches.forEach(match => {
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
      });
      callback(err, player);
    }
  });
}

router.get('/byleague/:id', (req, res) => {
  Division.getByLeagueId(req.params.id, (err, divisions) => {
    let count = 0;
    if (err) {
      res.json({
        success: false,
        message: err
      });
    } else {
      if (divisions.length === 0) res.json({
        success: true,
        all: []
      });
      divisions.forEach((division, dindex) => {
        count++;
        inner_count = 0;
        if (division.tournament) {
          division.players.forEach((player, index) => {
            calcTournamentStats(player, division._id, (err, result) => {
              inner_count++;
              divisions[dindex].players[index] = result;
              if (count === divisions.length && inner_count === division.players.length) {
                res.json({
                  success: true,
                  all: divisions
                });
              }
            });
          });
        }
        else {
          division.teams.forEach((team, index) => {
            calcStats(team, division._id, (err, result) => {
              inner_count++;
              divisions[dindex].teams[index] = result;
              if (count === divisions.length && inner_count === division.teams.length) {
                res.json({
                  success: true,
                  all: divisions
                });
              }
            });
          });
        }
      });
    }
  })
});

module.exports = router;
