const express = require('express');
const router = express.Router();
const model = require('../models');
const middleware = require('../middleware');
const rest = require('../utils/rest')

router.post("/",
  middleware.auth,
  (req, res, next) => {
    rest.create(req, res, next, model.Location)
})

router.get("/",
  (req, res, next) => {
    rest.get(req, res, next, model.Location)
})

router.get("/:id",
  (req, res, next) => {
    rest.get(req, res, next, model.Location)
})

router.put("/",
  middleware.auth,
  (req, res, next) => {
    rest.update(req, res, next, model.Location)
})

router.delete("/:id",
  middleware.auth,
  (req, res, next) => {
    rest.delete(req, res, next, model.Location)
})


module.exports = router;