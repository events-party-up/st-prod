const express = require('express');
const router = express.Router();

const Team = require('../models/Team');
const auth = require('../middlewares/auth');

router.post('/', auth.isLogged, (req, res) => {
  let team = new Team({
    name: req.body.name,
    players: req.body.players,
    league: req.body.league,
    court_loc: req.body.court_loc,
    tc: req.body.tc,
    tc_email: req.body.tc_email,
    tc_phone: req.body.tc_phone,
    lsta_visa: req.body.lsta_visa
  });
  Team.create(team, (err, team) => {
    if (err) {
      res.json({
        success: false,
        message: err
      });
    } else {
      res.json({
        success: true,
        team: team
      });
    }
  })
})

router.put('/', auth.isLogged, (req, res) => {
  let updatedTeam = new Team({
    ...req.body
  });
  Team.update(updatedTeam, (err, team) => {
    if (err) {
      res.json({
        success: false,
        message: err
      });
    } else {
      res.json({
        success: true
      });
    }
  })
});

router.delete('/:id', auth.isLogged, (req, res) => {
  Team.delete(req.params.id, (err, team) => {
    if (err) {
      res.json({
        success: false,
        message: err
      });
    } else {
      res.json({
        success: true
      });
    }
  })
});

router.get('/:id', (req, res) => {
  Team.getById(req.params.id, (err, team) => {
    if (err) {
      res.json({
        success: false,
        message: err
      });
    }
    else {
      res.json({
        success: true,
        team: team
      });
    }
  });
});

router.get('/byleague/:id', (req, res) => {
  Team.getByLeagueId(req.params.id, (err, teams) => {
    if (err) res.json({
      success: false,
      message: err
    });
    res.json({
      success: true,
      all: teams
    });
  })
});

module.exports = router;
