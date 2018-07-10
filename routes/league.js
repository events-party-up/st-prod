const express = require('express');
const router = express.Router();
const model = require('../models');
const middleware = require('../middleware');
const rest = require('../utils/rest')

router.post("/",
  middleware.auth,
  (req, res, next) => {
    rest.create(req, res, next, model.League)
})

router.put("/",
  middleware.auth,
  (req, res, next) => {
    rest.update(req, res, next, model.League)
})

router.delete("/:id",
  middleware.auth,
  (req, res, next) => {
    rest.delete(req, res, next, model.League)
})

router.get("/:id",
  (req, res, next) => {
    rest.get(req, res, next, model.League)
})

router.get('/all/:tournament?/:male?', (req, res, next) => {
  let options = {};
  if(req.params.tournament) options.tournament = req.params.tournament;
  if(req.params.gender) options.gender = req.params.gender;
  model.League.getAll(options, (err, leagues) => {
    if (err) next(err)
    res.json(leagues);
  })
});

module.exports = router;