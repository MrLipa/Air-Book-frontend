const express = require('express');
const oauth2Controller = require('../controllers/oauth2Controller');

const router = express.Router();

router.get('/facebook/callback', oauth2Controller.facebookCallback);

module.exports = router;
