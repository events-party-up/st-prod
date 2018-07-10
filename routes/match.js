const express = require('express');
const router = express.Router();
const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);
const async = require('async')
const model = require('../models');
const middleware = require('../middleware');
const rest = require('../utils/rest')

router.post("/",
  middleware.auth,
  (req, res, next) => {
    rest.create(req, res, next, model.Match)
  })

router.put("/",
  middleware.auth,
  (req, res, next) => {
    rest.update(req, res, next, model.Match)
  })

router.get("/:id",
  (req, res, next) => {
    rest.get(req, res, next, model.Match, {
      populate: [
        {
          model: 'Player',
          path: 'pvp.home.player',
        },
        {
          model: 'Player',
          path: 'pvp.away.player',
        },
        {
          model: 'Player',
          path: 'pvp.home.player2',
        },
        {
          model: 'Player',
          path: 'pvp.away.player2',
        },
        {
          model: 'Division',
          path: 'division',
          populate: {
            path: 'league',
            model: 'League'
          }
        },
        {
          model: 'Team',
          path: 'home.team'
        },
        {
          model: 'Team',
          path: 'away.team'
        },
        {
          model: 'Player',
          path: 'home.player'
        },
        {
          model: 'Player',
          path: 'away.player'
        }
      ]
    })
  })

router.delete("/:id",
  middleware.auth,
  (req, res, next) => {
    rest.delete(req, res, next, model.Match)
  })

router.get('/byplayer/:id', (req, res, next) => {
  model.Match.getByPlayerId(req.params.id, (err, matches) => {
    if (err) next(err)
    res.json(matches);
  });
});

router.get('/byteam/:id', (req, res, next) => {
  model.Match.getByTeamId(req.params.id, (err, matches) => {
    if (err) next(err);
    matches.forEach(match => {
      model.Match.calcScore(match, updatedMatch => {
        match = updatedMatch;
      })
    });
    res.json(matches);
  });
});

router.get('/bydivision/:id', (req, res, next) => {
  model.Match.getByDivisionId(req.params.id, (err, matches) => {
    if (err) next(err)
    async.each(matches, (match, callback) => {
      model.Match.calcScore(match, updatedMatch => {
        match = updatedMatch;
      });
      callback();
    }, err => {
      if (err) next(err)
      res.json(matches)
    });
  })
});

router.get('/bydatendiv/:start/:end', (req, res, next) => {
  model.Match.getByDivisionIds(req.query.divisions.split(','), (err, matches) => {
    let startDate = new Date(req.params.start)
      , endDate = new Date(req.params.end)
      , range = moment().range(startDate, endDate);
    let list = [];
    if (err) next(err)
    let count = 0;
    if (matches.length === 0) {
      res.json(matches);
    }
    matches.forEach(match => {
      if (range.contains(new Date(match.date))) {
        model.Match.calcScore(match, updatedMatch => {
          list.push(updatedMatch);
        });
      }
      count++;
      if (count === matches.length) {
        res.json(list);
      }
    });
  })
});

router.get('/bydatent/:id/:start/:end', (req, res, next) => {
  let q = model.Tournament.findById(req.params.id)
  q.populate({
    path: 'brackets.matches.data',
    populate: [{
      path: 'home.player',
    },
    {
      path: 'away.player',
    },
    {
      path: 'away.team home.team ',
      populate: {
        path: 'players',
      },
    }]
  })
  q.then(tournament => {
    let matches = []
    tournament.brackets.forEach(bracket => {
      bracket.matches.forEach(match => {
        matches.push(match.data)
      })
    })
    let startDate = new Date(req.params.start)
      , endDate = new Date(req.params.end)
      , range = moment().range(startDate, endDate);
    let list = [];
    let count = 0;
    if (!tournament) {
      return next('Resource not found')
    }
    if (matches.length === 0) {
      res.json(matches);
    }
    matches.forEach(match => {
      if (range.contains(new Date(match.date))) {
        model.Match.calcScore(match, updatedMatch => {
          list.push(updatedMatch);
        });
      }
      count++;
      if (count === matches.length) {
        res.json(list);
      }
    });
  })
    .catch((err) => {
      // send the error to the error handler
      return next(err)
    })
});

router.get("/:id", (req, res, next) => {
  model.Match.getById(req.params.id, (err, match) => {
    if (err) next(err);
    model.Match.calcScore(match, updatedMatch => {
      match = updatedMatch;
    })
    res.json(match);
  });
});

module.exports = router;
