const express = require('express');
const router = express.Router();

const paintings = require('./paintings');

router.use('/paintings', paintings);

module.exports = router;