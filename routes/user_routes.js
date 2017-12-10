var express = require('express');
var router = express.Router();
var user_dal = require('../model/user_dal');
var wines_dal = require('../model/wines_dal');



// View All companys
router.get('/all', function(req, res) {
    user_dal.getAll(req.query.wines_id, function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('user/userViewAll', { 'result':result });
        }
    });

});

router.get('/selectwine', function(req, res){
    // passing all the query parameters (req.query) to the insert function instead of each individually
    wines_dal.getAll(function(err,result) {
        if (err) {
            res.send(err);
        }
        else {
            res.render('user/userAddSelectWine', {'wines': result});
        }
    });
});


module.exports = router;