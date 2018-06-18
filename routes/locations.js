const express = require('express');
const router = express.Router();
const Promise = require('bluebird');

const Location = require('../models/Location');
const auth = require('../middlewares/auth');

// adds a new Location to the database
router.post('/', auth.isLogged, (req, res) => {
  let location = new Location({
    ...req.body
  });
  Location.create(location, (err, loc) => {
    if (err) {
      res.json({
        success: false,
        message: err
      });
    }
    else {
      res.json({
        success: true
      });
    }
  })
});

// returns all locations from the database
router.get('/', (req, res) => {
  Location.getAll((err, locations) => {
    if (err) res.json({
      success: false,
      message: err
    });
    res.json({
      success: true,
      locations: locations
    });
  })
});

// returns event by its ID
router.get('/:id', (req, res) => {
  Location.getById(req.params.id, (err, location) => {
    if (err) {
      res.json({
        success: false,
        message: err
      });
    }
    else {
      res.json({
        success: true,
        location: location
      });
    }
  });
});

// updates existing location data
router.put('/', auth.isLogged, (req, res) => {
  let location = new Location({
    ...req.body
  });
  Location.update(location, (err, loc) => {
    if (err) {
      res.json({
        success: false,
        message: err
      });
    }
    else {
      res.json({
        success: true
      });
    }
  });
});

// removes location from the database by its ID
router.delete('/:id', auth.isLogged, (req, res) => {
  Location.delete(req.params.id, (err) => {
    if (err) res.json({
      success: false,
      message: err
    });
    res.json({
      success: true
    });
  });
});

module.exports = router;
