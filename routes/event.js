const express = require('express');
const router = express.Router();
const model = require('../models');
const middleware = require('../middleware');
const rest = require('../utils/rest')

router.post("/",
  middleware.auth,
  (req, res, next) => {
    rest.create(req, res, next, model.Event)
  })

router.get("/",
  (req, res, next) => {
    rest.get(req, res, next, model.Event, {
      populate: [{
        model: 'Division',
        path: 'division'
      },
      {
        model: 'Tournament',
        path: 'tournament'
      }]
    })
  })

router.get("/:id",
  (req, res, next) => {
    rest.get(req, res, next, model.Event, {
      populate: [{
        model: 'Division',
        path: 'division',
        populate: {
          path: 'league',
          model: 'League'
        }
      },
      {
        model: 'Tournament',
        path: 'tournament'
      }]
    })
  })

router.put("/",
  middleware.auth,
  (req, res, next) => {
    rest.update(req, res, next, model.Event)
  })

router.delete("/:id",
  middleware.auth,
  (req, res, next) => {
    rest.delete(req, res, next, model.Event)
  })

module.exports = router;
