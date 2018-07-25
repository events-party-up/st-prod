const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config');
const model = require('../models');
const middleware = require('../middleware');
const rest = require('../utils/rest')

router.post('/register', middleware.auth, middleware.admin, (req, res) => {
  let newUser = model.User({
    ...req.body
  });
  model.User.create(newUser, (err, response) => {
    if (err) next(err)
    res.json(response);
  })
});

router.post("/auth", (req, res, next) => {
  let email = req.body.credentials.email,
    password = req.body.credentials.password
  if (email !== null && password !== null) {
    model.User.getByEmail(email, function (err, result) {
      if (err) return next(err)
      if (!result) return next("User not found!")
      let user = result._doc
      model.User.comparePassword(password, user.password, function (err, isMatch) {
        if (err) return next(err);
        if (isMatch) {
          user.password = undefined;
          user.created = undefined;
          const token = "Bearer " + jwt.sign({ uid: user._id }, config.JWT_SECRET, {
            expiresIn: 604800 // 1 week
          });
          res.json({
            ...user,
            token
          });
        } else {
          return next("Incorrect password!");
        }
      });
    });
  } else {
    return next("Missing credentials")
  }
});

router.get('/', middleware.auth, (req, res) => {
  model.User.getAll((err, response) => {
    if (err) next(err)
    res.json(response);
  })
});

router.put('/', middleware.auth, middleware.admin, (req, res) => {
  let updatedUser = new User({
    ...req.body
  });
  model.User.update(updatedUser, (err, response) => {
    if (err) next(err)
    res.json(response);
  })
});

router.delete("/",
  middleware.auth,
  middleware.admin,
  (req, res, next) => {
    rest.delete(req, res, next, model.User)
  })

//validatinta useri
router.post("/validate",
  middleware.auth,
  (req, res) => {
    model.User.getById(req.uid, (err, user) => {
      if (err) next(err);
      if (!user) next('User not found!')
      res.json({
        _id: user._id,
        email: user.email,
        name: user.name
      })
    });
  });

module.exports = router;
