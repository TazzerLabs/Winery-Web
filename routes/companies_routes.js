var express = require('express');
var router = express.Router();
var companies_dal = require('../model/companies_dal');
var location_dal = require('../model/location_dal');

router.get('/success', function(req, res) {
    res.render('companies/companiesSuccess');
});

// View All companiess
router.get('/all', function(req, res) {
    companies_dal.getAll(function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('companies/companiesViewAll', { 'result':result });
        }
    });

});

// View the companies for the given id
router.get('/', function(req, res){
    if(req.query.companies_id == null) {
        res.send('companies_id is null');
    }
    else {
        companies_dal.getById(req.query.companies_id, function(err,result) {
           if (err) {
               res.send(err);
           }
           else {
               res.render('companies/companiesViewById', {'result': result});
           }
        });
    }
});

// Return the add a new companies form
router.get('/add', function(req, res){
    // passing all the query parameters (req.query) to the insert function instead of each individually
    location_dal.getAll(function(err,result) {
        if (err) {
            res.send(err);
        }
        else {
            res.render('companies/companiesAdd', {'location': result});
        }
    });
});

// View the companies for the given id
router.get('/insert', function(req, res){
    // simple validation
    if(req.query.companies_name == null) {
        res.send('companies Name must be provided.');
    }
    else if(req.query.location_id == null) {
        res.send('At least one location must be selected');
    }
    else {
        // passing all the query parameters (req.query) to the insert function instead of each individually
        companies_dal.insert(req.query, function(err,companies_id) {
            if (err) {
                //console.log(err)
                res.send(err);
            }
            else {
                //poor practice for redirecting the user to a different page, but we will handle it differently once we start using Ajax
                companies_dal.edit(companies_id, function (err, result) {
                    //res.render('companies/companiesUpdate', {companies: result[0][0], location: result[1]});
                    res.redirect(302, '/companies/success');
                });
            }
        });
    }
});

router.get('/edit', function(req, res){
    if(req.query.companies_id == null) {
        res.send('A companies id is required');
    }
    else {
        companies_dal.edit(req.query.companies_id, function(err, result){
            res.render('companies/companiesUpdate', {companies: result[0][0], location: result[1], was_successful: true});
        });
    }

});

router.get('/edit2', function(req, res){
   if(req.query.companies_id == null) {
       res.send('A companies id is required');
   }
   else {
       companies_dal.getById(req.query.companies_id, function(err, companies){
           location_dal.getAll(function(err, location) {
               res.render('companies/companiesUpdate', {companies: companies[0], location: location});

           });
       });
   }

});

router.get('/update', function(req, res) {
    companies_dal.update(req.query, function(err, result){
        res.redirect(302, '/companies/success');
    });
});

// Delete a companies for the given companies_id
router.get('/delete', function(req, res){
    if(req.query.companies_id == null) {
        res.send('companies_id is null');
    }
    else {
         companies_dal.delete(req.query.companies_id, function(err, result){
             if(err) {
                 res.send(err);
             }
             else {
                 //poor practice, but we will handle it differently once we start using Ajax
                 res.redirect(302, '/companies/all');
             }
         });
    }
});

module.exports = router;
