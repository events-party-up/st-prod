const express = require('express');
const router = express.Router();

const users = require('./users')
const players = require('./players')
const leagues = require('./leagues')
const teams = require('./teams')
const divisions = require('./divisions')
const matches = require('./matches')
const events = require('./events')

router.use('/leagues', leagues);
router.use('/users', users);
router.use('/players', players);
router.use('/teams', teams);
router.use('/divisions', divisions);
router.use('/matches', matches);
router.use('/events', events);

module.exports = router;
