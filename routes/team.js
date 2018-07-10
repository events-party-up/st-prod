const express = require('express');
const router = express.Router();
const model = require('../models');
const middleware = require('../middleware');
const rest = require('../utils/rest')

router.post("/",
  middleware.auth,
  (req, res, next) => {
    rest.create(req, res, next, model.Team)
  })

router.get("/",
  (req, res, next) => {
    rest.get(req, res, next, model.Team)
  })

router.get("/:id",
  (req, res, next) => {
    rest.get(req, res, next, model.Team, {
      populate: [{
        model: 'Player',
        path: 'players'
      }]
    })
  })

router.put("/",
  middleware.auth,
  (req, res, next) => {
    rest.update(req, res, next, model.Team)
  })

router.get("/byleague/:lid",
  (req, res, next) => {
    rest.get(req, res, next, model.Team, {
      find: { league : req.params.lid },
      // populate: [
      //   {
      //     model: 'League',
      //     path: 'league'
      //   },
      //   {
      //     model: 'Team',
      //     path: 'teams'
      //   },
      //   {
      //     model: 'Player',
      //     path: 'players'
      //   }
      // ]
    })
  })

router.delete("/:id",
  middleware.auth,
  (req, res, next) => {
    rest.delete(req, res, next, model.Team)
  })

module.exports = router;