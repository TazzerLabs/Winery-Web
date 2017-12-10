var express = require('express');
var router = express.Router();
var location_dal = require('../model/location_dal');


router.get('/success', function(req, res) {
    res.render('location/locationSuccess');
});

// View All companys
router.get('/all', function(req, res) {
    location_dal.getAll(function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('location/locationViewAll', { 'result':result });
        }
    });

});

// View the company for the given id
router.get('/', function(req, res){
    if(req.query.location_id == null) {
        res.send('location_id is null');
    }
    else {
        location_dal.getById(req.query.location_id, function(err,result) {
           if (err) {
               res.send(err);
           }
           else {
               res.render('location/locationViewById', {'result': result});
           }
        });
    }
});

// Return the add a new company form
router.get('/add', function(req, res){
    // passing all the query parameters (req.query) to the insert function instead of each individually
    location_dal.getAll(function(err,result) {
        if (err) {
            res.send(err);
        }
        else {
            res.render('location/locationAdd', {'location': result});
        }
    });
});

// View the company for the given id
router.get('/insert', function(req, res){
    // simple validation
    if(req.query.street == null) {
        res.send('Street Name must be provided.');
    }
    else if(req.query.zip_code == null) {
        res.send('Zip Code must be provided. ');
    }
    else {
        // passing all the query parameters (req.query) to the insert function instead of each individually
        location_dal.insert(req.query, function(err,result) {
            if (err) {
                console.log(err)
                res.send(err);
            }
            else {
                //poor practice for redirecting the user to a different page, but we will handle it differently once we start using Ajax
                res.redirect(302, '/location/success');
            }
        });
    }
});

router.get('/edit', function(req, res){
    if(req.query.location_id == null) {
        res.send('An location id is required');
    }
    else {
        location_dal.edit(req.query.location_id, function(err, result){
            res.render('location/locationUpdate', {'location': result[0] });
        });
    }

});

router.get('/update', function(req, res) {
    location_dal.update(req.query, function(err, result){
        res.redirect(302, '/location/success');
    });
});

// Delete a company for the given company_id
router.get('/delete', function(req, res)
{
    if(req.query.location_id == null) {
        res.send('location_id is null');
    }
    else {
         location_dal.delete(req.query.location_id, function(err, result)
         {
             if(err)
             {
                 res.send(err);
             }
             else
             {
                 //poor practice, but we will handle it differently once we start using Ajax
                 res.redirect(302, '/location/all');
             }
         });
    }
});

module.exports = router;
