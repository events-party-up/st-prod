const express = require('express');
const router = express.Router();

router.use('/league', require('./league'));
router.use('/user', require('./user'));
router.use('/player', require('./player'));
router.use('/team', require('./team'));
router.use('/division', require('./division'));
router.use('/match', require('./match'));
router.use('/event', require('./event'));
router.use('/teamreg', require('./teamreg'));
router.use('/location', require('./location'));
router.use('/tournament', require('./tournament'));

module.exports = router;
