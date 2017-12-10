var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('/aboutpage', { title: 'About Us' });
});

module.exports = router;