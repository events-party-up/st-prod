const express = require('express');
const router = express.Router();

const League = require('../models/League')
const auth = require('../middlewares/auth');

// adds a new league to the database
router.post('/', auth.isLogged, (req, res) => {
  let league = new League({
    ...req.body
  });
  League.create(league, (err, item) => {
    if (err) {
      res.json({
        success: false,
        message: err
      });
    } else {
      res.json({
        success: true,
        league: item
      });
    }
  })
});

router.delete('/:id', auth.isLogged, auth.isAdmin, (req, res) => {
  League.delete(req.params.id, (err, removed) => {
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
  });
});

// updates existing league data
router.put('/', auth.isLogged, (req, res) => {
  let league = new League({
    ...req.body
  });
  League.update(league, (err, le) => {
    if (err) res.json({
      success: false,
      message: err
    });
    res.json({
      success: true
    });
  });
});

router.get('/all/:tournament?/:male?', (req, res) => {
  let options = {};
  if(req.params.tournament) options.tournament = req.params.tournament;
  if(req.params.gender) options.gender = req.params.gender;
  League.getAll(options, (err, leagues) => {
    if (err) res.json({
      success: false,
      message: err
    });
    res.json({
      success: true,
      all: leagues
    });
  })
});

// // returns all leagues from the database
// router.get('/all/:tournament', auth.isLogged, (req, res) => {
//   League.getAll({tournament: req.params.tournament}, (err, leagues) => {
//     if (err) res.json({
//       success: false,
//       message: err
//     });
//     res.json({
//       success: true,
//       all: leagues
//     });
//   })
// });

router.get('/:id', (req, res) => {
  League.getById(req.params.id, (err, league) => {
    if (err) res.json({
      success: false,
      message: err
    });
    res.json({
      success: true,
      league: league
    });
  })
});

module.exports = router;
