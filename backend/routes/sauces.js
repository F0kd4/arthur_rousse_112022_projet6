const express = require('express');
const auth = require('auth');
const router = express.Router();


const sauceCtrl = require('../controllers/sauces');

router.post('/', auth, sauceCtrl.createSauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.get('/', auth, sauceCtrl.getAllSauces);

module.exports = router;