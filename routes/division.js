const express = require('express');
const router = express.Router();
const async = require('async');
const model = require('../models');
const middleware = require('../middleware');
const rest = require('../utils/rest');

router.post("/",
  middleware.auth,
  (req, res, next) => {
    rest.create(req, res, next, model.Division)
  })

router.put("/",
  (req, res, next) => {
    rest.update(req, res, next, model.Division)
  })

router.get("/",
  (req, res, next) => {
    rest.get(req, res, next, model.Division, {
      populate: [
        {
          model: 'League',
          path: 'league'
        },
        {
          model: 'Player',
          path: 'players'
        },
        {
          model: 'Team',
          path: 'teams'
        }
      ]
    })
  })

router.get("/lid/:lid",
  (req, res, next) => {
    rest.get(req, res, next, model.Division, {
      find: { league : req.params.lid },
      populate: [
        {
          model: 'League',
          path: 'league'
        },
        {
          model: 'Player',
          path: 'players'
        },
        {
          model: 'Team',
          path: 'teams'
        }
      ]
    })
  })

// router.get("/byleague/:id",
//   middleware.auth,
//   (req, res, next) => {
//     rest.get(req, res, next, model.Division, {
//       find: {'league' : req.params.id},
//       populate: [
//         {
//           model: 'League',
//           path: 'league'
//         },
//         {
//           model: 'Team',
//           path: 'teams'
//         },
//         {
//           model: 'Player',
//           path: 'players'
//         }
//       ]
//     })
//   })

router.get("/:id",
  middleware.auth,
  (req, res, next) => {
    rest.get(req, res, next, model.Division, {
      populate: [
        {
          model: 'Team',
          path: 'teams',
          populate: {
            path: 'players',
            model: 'Player'
          }
        },
        {
          model: 'Player',
          path: 'players'
        }
      ]
    })
  })

router.delete("/:id",
  middleware.auth,
  (req, res, next) => {
    rest.delete(req, res, next, model.Division)
  })

function calcStats(item, matches, division_id, callback) {
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

function calcTournamentStats(item, division_id, callback) {
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

processDivisions = (divisions, callback) => {
  async.eachOfSeries(divisions, (division, key, done) => {
    if (division.tournament) {
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

router.get('/byleague/:id/:default_filtering?/:season?', (req, res, next) => {
  model.League.getById(req.params.id, (err, league) => {
    model.Division.getByLeagueId(req.params.id, (err, divisions) => {
      if (err || divisions.length === 0) next(err || 'No divisions found')
      else {
        let divs = [...divisions];
        if (req.params.default_filtering === 'null' && league.season && !req.params.season) {
          divs = divisions.filter(x => x.season && x.season === league.season);
        } else if (league.season && req.params.season) {
          divs = divisions.filter(x => x.season && x.season === parseInt(req.params.season));
        }
        processDivisions(divs, divisions => {
          res.json(divisions);
        });
      }

    })
  });
});

module.exports = router;
