var express = require('express');
var router = express.Router();
var wines_dal = require('../model/wines_dal');
var wineries_dal = require('../model/wineries_dal');

router.get('/success', function(req, res) {
    res.render('wines/winesSuccess');
});

// View All winess
router.get('/all', function(req, res) {
    wines_dal.getAll(function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('wines/winesViewAll', { 'result':result });
        }
    });

});

// View the wines for the given id
router.get('/', function(req, res){
    if(req.query.wines_id == null) {
        res.send('wines_id is null');
    }
    else {
        wines_dal.getById(req.query.wines_id, function(err,result) {
            if (err) {
                res.send(err);
            }
            else {
                res.render('wines/winesViewById', {'result': result});
            }
        });
    }
});

// Return the add a new wines form
router.get('/add', function(req, res){
    // passing all the query parameters (req.query) to the insert function instead of each individually
    wineries_dal.getAll(function(err,result) {
        if (err) {
            res.send(err);
        }
        else {
            res.render('wines/winesAdd', {'wineries': result});
        }
    });
});

// View the wines for the given id
router.get('/insert', function(req, res){
    // simple validation
    if(req.query.wines_name == null) {
        res.send('wines Name must be provided.');
    }
    else if(req.query.wineries_id == null) {
        res.send('At least one wineries must be selected');
    }
    else {
        // passing all the query parameters (req.query) to the insert function instead of each individually
        wines_dal.insert(req.query, function(err,wines_id) {
            if (err) {
                //console.log(err)
                res.send(err);
            }
            else {
                //poor practice for redirecting the user to a different page, but we will handle it differently once we start using Ajax
                wines_dal.edit(wines_id, function (err, result) {
                    //res.render('wines/winesUpdate', {wines: result[0][0], wineries: result[1]});
                    res.redirect(302, '/wines/success');
                });
            }
        });
    }
});

router.get('/edit', function(req, res){
    if(req.query.wines_id == null) {
        res.send('A wines id is required');
    }
    else {
        wines_dal.edit(req.query.wines_id, function(err, result){
            res.render('wines/winesUpdate', result);
        });
    }

});

router.get('/edit2', function(req, res){
    if(req.query.wines_id == null) {
        res.send('A wines id is required');
    }
    else {
        wines_dal.getById(req.query.wines_id, function(err, wines){
            wineries_dal.getAll(function(err, wineries) {
                res.render('wines/winesUpdate', {wines: wines[0], wineries: wineries});

            });
        });
    }

});

router.get('/update', function(req, res) {
    wines_dal.update(req.query, function(err, result){
        res.redirect(302, '/wines/success');
    });
});

// Delete a wines for the given wines_id
router.get('/delete', function(req, res){
    if(req.query.wines_id == null) {
        res.send('wines_id is null');
    }
    else {
        wines_dal.delete(req.query.wines_id, function(err, result){
            if(err) {
                res.send(err);
            }
            else {
                //poor practice, but we will handle it differently once we start using Ajax
                res.redirect(302, '/wines/all');
            }
        });
    }
});

module.exports = router;