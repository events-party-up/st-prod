const express = require('express');
const router = express.Router();
const Promise = require('bluebird');

const TeamReg = require('../models/TeamReg')
const Division = require('../models/Division');
const auth = require('../middlewares/auth');

// adds a new team registration to the database
router.post('/', (req, res) => {
  let teamReg = new TeamReg({
    ...req.body
  });
  console.log(req.body);
  TeamReg.create(teamReg, (err, e) => {
    if (err) {
      res.json({
        success: false,
        message: err
      });
    }
    else {
      res.json({
        success: true,
        teamReg: e
      });
    }
  })
});

// returns all team registratins from the database
router.get('/', (req, res) => {
  TeamReg.getAll((err, teamregs) => {
    if (err) res.json({
      success: false,
      message: err
    });
    res.json({
      success: true,
      teamregs: teamregs
    });
  })
});

// returns event by its ID
router.get('/:id', (req, res) => {
  TeamReg.getById(req.params.id, (err, teamReg) => {
    if (err) {
      res.json({
        success: false,
        message: err
      });
    }
    else {
      res.json({
        success: true,
        teamreg: teamReg
      });
    }
  });
});

// updates existing team registration data
router.put('/', auth.isLogged, (req, res) => {
  let teamreg = new TeamReg({
    ...req.body
  });
  TeamReg.update(teamreg, (err, e) => {
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

// removes team registration from the database by its ID
router.delete('/:id', auth.isLogged, (req, res) => {
  TeamReg.delete(req.params.id, (err) => {
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
