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
      find: { league: req.params.lid },
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
        model.Division.processDivisions(divs, divisions => {
          res.json(divisions);
        });
      }

    })
  });
});

module.exports = router;
