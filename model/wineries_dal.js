// A TazzerLabs Production..
var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

/*
 create or replace view companies_view as
 select s.*, a.street, a.zip_code from companies s
 join address a on a.address_id = s.address_id;

 */

exports.getAll = function(callback) {
    var query = 'SELECT * FROM wineries;';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};


/*
DROP PROCEDURE IF EXISTS wineries_getinfo;

DELIMITER //
CREATE PROCEDURE wineries_getinfo(_wineries_id int)
BEGIN

SELECT * FROM wineries w WHERE w.wineries_id = _wineries_id;

SELECT wc.*, c.companies_name FROM wineries_companies wc
JOIN companies c ON c.companies_id = wc.companies_id
WHERE wc.wineries_id = _wineries_id;

SELECT wl.*, l.location_name FROM wineries_location wl
JOIN location l ON l.location_id = wl.location_id
WHERE wl.wineries_id = _wineries_id;

SELECT ws.*, s.specialty_name FROM wineries_specialty ws
JOIN specialty s ON s.specialty_id = ws.specialty_id
WHERE ws.wineries_id = _wineries_id;

END //
DELIMITER ;

 */

exports.getById = function(wineries_id, callback) {
    var query = 'CALL wineries_getinfo(?)';
    var queryData = [wineries_id];

    connection.query(query, queryData, function (err, result) {
        callback(err, result);
    });
};

exports.getAttributesForUpdate = function(callback) {
    var query = 'CALL all_companies_location_specialty()';
    connection.query(query, function(err, result){
        callback(err, result);
    });
};

exports.insert = function(params, callback) {
    var query = 'INSERT INTO wineries(name, symbol) VALUES (?, ?)';
    var queryData = [params.name, params.symbol];
    connection.query(query, queryData, function(err, result){
        if (err) {
            callback(err, null);
        }
        else
        {
            //Use the inserted[tables]Id here so you can get the info and use later
            var insertedwineriesId = result.insertId;
            var wineriescompaniesData = [];
            for (var i = 0; i < params.companies_id.length; i++) {
                wineriescompaniesData.push([insertedwineriesId, params.companies_id[i]]);
            }
            var winerieslocationData = [];
            for (var i = 0; i < params.location_id.length; i++) {
                winerieslocationData.push([insertedwineriesId, params.location_id[i]]);
            }
            var wineriesspecialtyData = [];
            for (var i = 0; i < params.specialty_id.length; i++) {
                wineriesspecialtyData.push([insertedwineriesId, params.specialty_id[i]]);
            }
            var query = "INSERT INTO wineries_companies (wineries_id, companies_id) VALUES ?";
            connection.query(query, [wineriescompaniesData], function(err, result){
                if (err)
                    callback(err, null);
                else {
                    var query = "INSERT INTO wineries_location(wineries_id, location_id) VALUES ?";
                    connection.query(query, [winerieslocationData], function(err, result){
                        if (err)
                            callback(err, null);
                        else {
                            var query = "INSERT INTO wineries_specialty(wineries_id, specialty_id) VALUES ?";
                            connection.query(query, [wineriesspecialtyData], function (err, result) {
                                callback(err, result);
                            });
                        }
                    });
                }
            });
        }
    });
};

exports.delete = function(wineries_id, callback) {
    var query = 'DELETE FROM wineries WHERE wineries_id = ?';
    var queryData = [wineries_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

exports.edit = function(wineries_id, callback) {
    var query = 'CALL wineries_getinfo(?);';
    var queryData = [wineries_id];

    connection.query(query, queryData, function(err, result) {
        if (err)
            callback(err, null);
        else {
            var wineriesData = {
                'wineries': result[0],
                'companies': result[1],
                'location': result[2],
                'specialty': result[3]
            };
            var query = 'CALL all_companies_location_specialty()';
            connection.query(query, null, function(err, result){
                wineriesData.companies = result[0];
                wineriesData.location = result[1];
                wineriesData.specialty = result[2];
                callback(err, wineriesData);
            });
        }
    });
};

//Deletes
var deleteCompanies = function(wineries_id, callback) {
    var query = "DELETE FROM wineries_companies " +
        "WHERE wineries_id = ?";
    connection.query(query, [wineries_id], function(err, result){
        callback(err, result);
    });
};
var deletelocations = function(wineries_id, callback) {
    var query = "DELETE FROM wineries_location " +
        "WHERE wineries_id = ?";
    connection.query(query, [wineries_id], function(err, result){
        callback(err, result);
    });
};
var deletespecialtys= function(wineries_id, callback) {
    var query = "DELETE FROM wineries_specialty " +
        "WHERE wineries_id = ?";
    connection.query(query, [wineries_id], function(err, result){
        callback(err, result);
    });
};

// Inserts
var insertCompanies = function(companies, callback) {
    var query = "INSERT INTO wineries_companies (wineries_id, companies_id) VALUES ?";
    connection.query(query, [companies], function(err, result){
        callback(err, result);
    });
};
var insertlocations = function(locations, callback) {
    var query = "INSERT INTO wineries_location (wineries_id, location_id) VALUES ?";
    connection.query(query, [locations], function(err, result){
        callback(err, result);
    });
};
var insertspecialtys= function(specialtys, callback) {
    var query = "INSERT INTO wineries_specialty (wineries_id, specialty_id) VALUES ?";
    connection.query(query, [specialtys], function(err, result){
        callback(err, result);
    });
};

exports.update = function(params, callback) {
    console.log("Update has params:\n", params);
    var query = "UPDATE wineries SET name = ?, symbol = ? " +
        "WHERE wineries_id = ?";
    var wineriesData = [params.name, params.symbol, params.wineries_id];
    var wineries_id = params.wineries_id;
    connection.query(query, wineriesData, function(err, result){
        if (err)
            callback(err, null);
        else {

            var wineriescompaniesData = [];
            if (params.hasOwnProperty('companies_id')) {
                for (var i = 0; i < params.companies_id.length; i++) {
                    wineriescompaniesData.push([wineries_id, params.companies_id[i]]);
                }
            }
            var winerieslocationData = [];
            if (params.hasOwnProperty('location_id')) {
                for (var i = 0; i < params.location_id.length; i++) {
                    winerieslocationData.push([wineries_id, params.location_id[i]]);
                }
            }
            var wineriesspecialtyData = [];
            if (params.hasOwnProperty('specialty_id')) {
                for (var i = 0; i < params.specialty_id.length; i++) {
                    wineriesspecialtyData.push([wineries_id, params.specialty_id[i]]);
                }
            }

            /*
             * KNOWN BUG: if any of the categories have nothing,
             * there is a MySQL parse error, since we try INSERT INTO
             * with values of ''.
             *
             */

            //1. Delete all companies from the user
            deleteCompanies(wineries_id, function(err, resul) {
                if (err) {
                    console.log(err);
                    callback(err, null);
                } else {
                    //2. Re-insert all selected companies
                    insertCompanies(wineriescompaniesData, function (err, resul) {
                        if (err) {
                            console.log(err);
                            callback(err, null);
                        } else {
                            //3. Delete all locations from the user
                            deletelocations(wineries_id, function(err, resul) {
                                if (err) {
                                    console.log(err);
                                    callback(err, null);
                                } else {
                                    //4. Re-insert all selected locations
                                    insertlocations(winerieslocationData, function (err, resul) {
                                        if (err) {
                                            console.log(err);
                                            callback(err, null);
                                        } else {
                                            //5. Delete all specialtys from the user
                                            deletespecialtys(wineries_id, function(err, resul) {
                                                if (err) {
                                                    console.log(err);
                                                    callback(err, null);
                                                } else {
                                                    //6. Re-insert all selected specialtys
                                                    insertspecialtys(wineriesspecialtyData, function (err, resul) {
                                                        if (err) {
                                                            console.log(err);
                                                            callback(err, null);
                                                        } else {
                                                            callback(null, null);
                                                        } // End of specialty insertion
                                                    });
                                                } // End of specialty deletion
                                            });
                                        } // End of location insertion
                                    });
                                } // end of location deletion
                            });
                        } // end of companies insertion
                    });
                } // end of companies deletion
            });
        } // end of wineries update
    });
};