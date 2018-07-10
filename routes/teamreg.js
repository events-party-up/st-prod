const express = require('express');
const router = express.Router();
const model = require('../models');
const middleware = require('../middleware');
const rest = require('../utils/rest')

router.post("/",
  (req, res, next) => {
    rest.create(req, res, next, model.TeamReg)
})

router.get("/",
  (req, res, next) => {
    rest.get(req, res, next, model.TeamReg)
})

router.get("/:id",
  (req, res, next) => {
    rest.get(req, res, next, model.TeamReg)
})

router.put("/",
  middleware.auth,
  (req, res, next) => {
    rest.update(req, res, next, model.TeamReg)
})

router.delete("/:id",
  middleware.auth,
  (req, res, next) => {
    rest.delete(req, res, next, model.TeamReg)
})


module.exports = router;