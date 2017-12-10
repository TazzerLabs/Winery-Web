var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

exports.getAll = function(callback) {
    var query = 'SELECT * FROM location;';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.getById = function(location_id, callback) {
    var query = 'SELECT * from location where location_id = ?';
    var queryData = [location_id];
    console.log(query);

    connection.query(query, queryData, function(err, result) {

        callback(err, result);
    });
};

exports.insert = function(params, callback) {

    // FIRST INSERT THE COMPANY
    var query = 'INSERT INTO location (street, zip_code) VALUES (?, ?)';

    var queryData = [params.street, params.zip_code];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });

};

exports.delete = function(location_id, callback) {
    var query = 'DELETE FROM location WHERE location_id = ?';
    var queryData = [location_id];

    connection.query(query, location_id, function(err, result) {
        callback(err, result);
    });
};

exports.update = function(params, callback) {
    var query = 'UPDATE location SET street = ?, zip_code = ? WHERE location_id = ?';
    var queryData = [params.street, params.zip_code, params.location_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });

};

/*  Stored procedure used in this example
 DROP PROCEDURE IF EXISTS company_getinfo;

 DELIMITER //
 CREATE PROCEDURE company_getinfo (company_id int)
 BEGIN

 SELECT * FROM company WHERE company_id = _company_id;

 SELECT a.*, s.company_id FROM location a
 LEFT JOIN company_location s on s.location_id = a.location_id AND company_id = _company_id;

 END //
 DELIMITER ;

 # Call the Stored Procedure
 CALL company_getinfo (4);

 */

exports.edit = function(location_id, callback) {
    var query = 'select * from location where location_id = ?';
    var queryData = [location_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};