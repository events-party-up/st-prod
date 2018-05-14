const express = require('express');
const router = express.Router();
const Promise = require('bluebird');

const Event = require('../models/Event')
const Division = require('../models/Division');
const auth = require('../middlewares/auth');

// adds a new event to the database
router.post('/', auth.isLogged, (req, res) => {
  let event = new Event({
    ...req.body
  });
  Event.create(event, (err, e) => {
    if (err) {
      res.json({
        success: false,
        message: err
      });
    }
    else {
      res.json({
        success: true,
        player: e
      });
    }
  })
});

// returns all players from the database
router.get('/', (req, res) => {
  Event.getAll((err, events) => {
    if (err) res.json({
      success: false,
      message: err
    });
    console.log(events)
    res.json({
      success: true,
      events: events
    });
  })
});

// returns event by its ID
router.get('/:id', (req, res) => {
  Event.getById(req.params.id, (err, event) => {
    if (err) {
      res.json({
        success: false,
        message: err
      });
    }
    else {
      res.json({
        success: true,
        event: event
      });
    }
  });
});

// updates existing event data
router.put('/', auth.isLogged, (req, res) => {
  let event = new Event({
    ...req.body
  });
  Event.update(event, (err, e) => {
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

// removes player from the database by its ID
router.delete('/:id', auth.isLogged, (req, res) => {
  Event.delete(req.params.id, (err) => {
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
