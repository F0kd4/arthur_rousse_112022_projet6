const express = require('express');
const auth = require('auth');
const router = express.Router();


const sauceCtrl = require('../controllers/sauces');

router.post('/', sauceCtrl.createSauce);

module.exports = router;