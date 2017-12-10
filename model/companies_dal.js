var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

/*
 create or replace view companies_view as
 select s.*, a.street, a.zip_code from companies s
 join location a on a.location_id = s.location_id;

 */

exports.getAll = function(callback) {
    var query = 'SELECT * FROM companies;';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.getById = function(companies_id, callback) {
    var query = 'SELECT * FROM companiesGetById ' +
        'WHERE companies_id = ?';
    var queryData = [companies_id];
    console.log(query);

    connection.query(query, queryData, function(err, result) {

        callback(err, result);
    });
};

exports.insert = function(params, callback) {

    // FIRST INSERT THE companies
    var query = 'INSERT INTO companies (companies_name) VALUES (?)';

    var queryData = [params.companies_name];

    connection.query(query, params.companies_name, function(err, result) {

        // THEN USE THE companies_ID RETURNED AS insertId AND THE SELECTED location_IDs INTO companies_location
        var companies_id = result.insertId;

        // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
        var query = 'INSERT INTO companies_location (companies_id, location_id) VALUES ?';

        // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
        var companieslocationData = [];
        if (params.location_id.constructor === Array) {
            for (var i = 0; i < params.location_id.length; i++) {
                companieslocationData.push([companies_id, params.location_id[i]]);
            }
        }
        else {
            companieslocationData.push([companies_id, params.location_id]);
        }

        // NOTE THE EXTRA [] AROUND companieslocationData
        connection.query(query, [companieslocationData], function(err, result){
            callback(err, companies_id);
        });
    });

};

exports.delete = function(companies_id, callback) {
    var query = 'DELETE FROM companies WHERE companies_id = ?';
    var queryData = [companies_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });

};

//declare the function so it can be used locally
var companieslocationInsert = function(companies_id, locationIdArray, callback){
    // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
    var query = 'INSERT INTO companies_location (companies_id, location_id) VALUES ?';

    // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
    var companieslocationData = [];
    if (locationIdArray.constructor === Array) {
        for (var i = 0; i < locationIdArray.length; i++) {
            companieslocationData.push([companies_id, locationIdArray[i]]);
        }
    }
    else {
        companieslocationData.push([companies_id, locationIdArray]);
    }
    connection.query(query, [companieslocationData], function(err, result){
        callback(err, result);
    });
};
//export the same function so it can be used by external callers
module.exports.companieslocationInsert = companieslocationInsert;

//declare the function so it can be used locally
var companieslocationDeleteAll = function(companies_id, callback){
    var query = 'DELETE FROM companies_location WHERE companies_id = ?';
    var queryData = [companies_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};
//export the same function so it can be used by external callers
module.exports.companieslocationDeleteAll = companieslocationDeleteAll;

exports.update = function(params, callback) {
    var query = 'UPDATE companies SET companies_name = ? WHERE companies_id = ?';
    var queryData = [params.companies_name, params.companies_id];

    connection.query(query, queryData, function(err, result) {
        //delete companies_location entries for this companies
        companieslocationDeleteAll(params.companies_id, function(err, result){

            if(params.location_id != null) {
                //insert companies_location ids
                companieslocationInsert(params.companies_id, params.location_id, function(err, result){
                    callback(err, result);
                });}
            else {
                callback(err, result);
            }
        });

    });
};

/*  Stored procedure used in this example
     DROP PROCEDURE IF EXISTS companies_getinfo;

     DELIMITER //
     CREATE PROCEDURE companies_getinfo (companies_id int)
     BEGIN

     SELECT * FROM companies WHERE companies_id = _companies_id;

     SELECT a.*, s.companies_id FROM location a
     LEFT JOIN companies_location s on s.location_id = a.location_id AND companies_id = _companies_id;

     END //
     DELIMITER ;

     # Call the Stored Procedure
     CALL companies_getinfo (4);

 */

exports.edit = function(companies_id, callback) {
    var query = 'CALL companies_getinfo(?)';
    var queryData = [companies_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};