var express = require('express');
var router = express.Router();
var wineries_dal = require('../model/wineries_dal')


router.get('/success', function(req, res) {
    res.render('wineries/wineriesSuccess');
});


router.get('/all', function(req, res) {
    wineries_dal.getAll(function(err, result) {
        if (err)
            res.send(err);
        else
            res.render('wineries/wineriesViewAll', {'result': result})
    });
});

router.get('/', function(req, res){
    if (req.query.wineries_id == null)
        res.send('wineries_id is null');
    else {
        wineries_dal.getById(req.query.wineries_id, function(err, result) {
            if (err)
                res.send(err);
            else {

                var wineries_data =
                    {
                        'wineries': result[0][0],
                        'companies': result[1],
                        'location': result[2],
                        'specialty': result[3]
                    };
                res.render('wineries/wineriesViewByID', wineries_data);
            }
        });
    }

});

router.get('/add', function(req, res) {
    wineries_dal.getAttributesForUpdate(function(err, result) {
        if (err)
            res.send(err);
        else
        {
            var companySchoolsSkills =
                {
                    'companies': result[0],
                    'location': result[1],
                    'specialty': result[2]
                };

            res.render('wineries/wineriesAdd', companySchoolsSkills);

        }
    });
});

router.get('/insert', function(req, res) {
    var wineriesData =
        {
            'name': req.query.name,
            'symbol': req.query.symbol,
            'companies_id': req.query.companies_id,
            'location_id': req.query.location_id,
            'specialty_id': req.query.specialty_id
        };
    wineries_dal.insert(wineriesData, function(err, result) {
        if (err) {
            console.log(err);
            res.send(err);
        } else
            res.redirect(302, '/wineries/success');
    });
});

router.get('/edit', function(req, res) {
    if (req.query.wineries_id == null)
        res.send('A wineries id is required');
    else {
        wineries_dal.edit(req.query.wineries_id, function(err, result) {
            res.render('wineries/wineriesUpdate', result);
        });
    }
});

router.get('/update', function(req, res) {
    wineries_dal.update(req.query, function(err, result) {
        res.redirect(302, '/wineries/success');
    });
});

router.get('/delete', function(req, res) {
    if (req.query.wineries_id == null)
        res.send('wineries_id is null');
    else {
        wineries_dal.delete(req.query.wineries_id, function(err, result) {
            if (err) {
                console.log(err);
                res.send(err);
            } else
                res.redirect(302, '/wineries/all');
        });
    }
});

module.exports = router;