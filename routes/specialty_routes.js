var express = require('express');
var router = express.Router();
var specialty_dal = require('../model/specialty_dal');


router.get('/success', function(req, res) {
    res.render('specialty/specialtySuccess');
});


// View All companys
router.get('/all', function(req, res) {
    specialty_dal.getAll(function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('specialty/specialtyViewAll', { 'result':result });
        }
    });

});

// View the company for the given id
router.get('/', function(req, res){
    if(req.query.specialty_id == null) {
        res.send('specialty_id is null');
    }
    else {
        specialty_dal.getById(req.query.specialty_id, function(err,result) {
           if (err) {
               res.send(err);
           }
           else {
               res.render('specialty/specialtyViewById', {'result': result});
           }
        });
    }
});

// Return the add a new company form
router.get('/add', function(req, res){
    // passing all the query parameters (req.query) to the insert function instead of each individually
    specialty_dal.getAll(function(err,result) {
        if (err) {
            res.send(err);
        }
        else {
            res.render('specialty/specialtyAdd', {'account': result});
        }
    });
});

// View the company for the given id
router.get('/insert', function(req, res){
    // simple validation
    if(req.query.specialty_name == null) {
        res.send('specialty Name must be provided.');
    }
    else if(req.query.description == null) {
        res.send('description must be provided. ');
    }
    else {
        // passing all the query parameters (req.query) to the insert function instead of each individually
        specialty_dal.insert(req.query, function(err,result) {
            if (err) {
                console.log(err)
                res.send(err);
            }
            else {
                //poor practice for redirecting the user to a different page, but we will handle it differently once we start using Ajax
                res.redirect(302, '/specialty/success');
            }
        });
    }
});

router.get('/edit', function(req, res){
    if(req.query.specialty_id == null) {
        res.send('An specialty id is required');
    }
    else {
        specialty_dal.edit(req.query.specialty_id, function(err, result){
            res.render('specialty/specialtyUpdate', {'specialty': result[0] });
        });
    }

});

router.get('/update', function(req, res) {
    specialty_dal.update(req.query, function(err, result){
        res.redirect(302, '/specialty/success');
    });
});

// Delete a company for the given company_id
router.get('/delete', function(req, res){
    if(req.query.specialty_id == null) {
        res.send('specialty_id is null');
    }
    else {
         specialty_dal.delete(req.query.specialty_id, function(err, result){
             if(err) {
                 res.send(err);
             }
             else {
                 //poor practice, but we will handle it differently once we start using Ajax
                 res.redirect(302, '/specialty/all');
             }
         });
    }
});

module.exports = router;
