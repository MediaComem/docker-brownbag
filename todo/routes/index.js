const express = require('express');
const os = require('os');

const router = express.Router();

// GET /
router.get('/', (req, res, next) => res.render('index'));

// GET /hostname
router.get('/meta', (req, res, next) => res.send({
  hostname: os.hostname()
}));

module.exports = router;
