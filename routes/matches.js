const express = require('express');
const router = express.Router();
const Moment = require('moment');
const MomentRange = require('moment-range');

const moment = MomentRange.extendMoment(Moment);

const Match = require('../models/Match');
const auth = require('../middlewares/auth');

router.post('/', auth.isLogged, (req, res) => {
  let newMatch = new Match({
    ...req.body
  });
  Match.create(newMatch, (err, match) => {
    if (err) {
      res.json({
        success: false,
        message: err
      });
    } else {
      res.json({
        success: true,
        match: match
      });
    }
  })
})

router.put('/:id', auth.isLogged, (req, res) => {
  let updatedMatch = new Match({
    ...req.body
  });
  Match.update(updatedMatch, (err, match) => {
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
  Match.delete(req.params.id, (err, match) => {
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

router.get('/byplayer/:id', (req, res) => {
  Match.getByPlayerId(req.params.id, (err, matches) => {
    if(err) {
      res.json({
        success: false,
        message: err
      });
    }
    else {
      res.json({
        success: true,
        all: matches
      });
    }
  });
});

router.get('/byteam/:id', (req, res) => {
  Match.getByTeamId(req.params.id, (err, matches) => {
    if(err) {
      res.json({
        success: false,
        message: err
      });
    }
    else {
      matches.forEach(match => {
        Match.calcScore(match, updatedMatch => {
          match = updatedMatch;
        })
      });
      res.json({
        success: true,
        all: matches
      });
    }
  });
});

router.get('/bydivision/:id', (req, res) => {
  Match.getByDivisionId(req.params.id, (err, matches) => {
    if(err) {
      res.json({
        success: false,
        message: err
      });
    } else {
      let count = 0;
      if(matches.length === 0) {
        res.json({
          success: true,
          all: matches
        });
      }
      matches.forEach(match => {
        Match.calcScore(match, updatedMatch => {
          match = updatedMatch;
          count++;
          if(count === matches.length) {
            res.json({
              success: true,
              all: matches
            });
          }
        });
      });
    }
  })
});

router.get('/bydatendiv/:id/:start/:end', (req, res) => {
  Match.getByDivisionId(req.params.id, (err, matches) => {
    let startDate = new Date(req.params.start)
    , endDate   = new Date(req.params.end)
    , range = moment().range(startDate, endDate);
    let list = [];
    if(err) {
      res.json({
        success: false,
        message: err
      });
    } else {
      let count = 0;
      if(matches.length === 0) {
        res.json({
          success: true,
          all: matches
        });
      }
      matches.forEach(match => {
        if(range.contains(new Date(match.date))) {
          Match.calcScore(match, updatedMatch => {
            list.push(updatedMatch);
          });
        }
        count++; 
        if(count === matches.length) {
          console.log(list);
          res.json({
            success: true,
            all: list
          });
        }
      });
    }
  })
});

router.get('/:id', (req, res) => {
  Match.getById(req.params.id, (err, match) => {
    if(err) {
      res.json({
        success: false,
        message: err
      });
    }
    else {
      Match.calcScore(match, updatedMatch => {
        match = updatedMatch;
      })
      res.json({
        success: true,
        all: match
      });
    }
  });
});

module.exports = router;
