const express = require('express');
const router = express.Router();
const model = require('../models');
const middleware = require('../middleware');
const rest = require('../utils/rest')

const popConf = {
  populate: [{
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
    }],
  }
  ],
}

router.post("/",
  middleware.auth,
  (req, res, next) => {
    rest.create(req, res, next, model.Tournament, popConf)
  })

router.get("/",
  (req, res, next) => {
    rest.get(req, res, next, model.Tournament)
  })

router.get("/:id",
  (req, res, next) => {
    rest.get(req, res, next, model.Tournament, popConf)
  })

router.put("/",
  middleware.auth,
  (req, res, next) => {
    rest.update(req, res, next, model.Tournament, popConf)
  })

router.delete("/:id",
  middleware.auth,
  (req, res, next) => {
    rest.delete(req, res, next, model.Tournament)
  })


module.exports = router;