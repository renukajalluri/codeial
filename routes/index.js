const express = require('express');

const router = express.Router();
const homeController = require('../controllers/home_controller');
const { route } = require('./comments');
// console.log('router')

// get an req from '/' this then will be forwarded to homeController.js
router.get('/',homeController.home);
router.use("/users",require('./users'));
router.use("/posts",require("./posts"));
router.use('/comments',require('./comments'));
router.use('/likes',require("./likes"))

router.use('/api',require('./api'))

module.exports = router;