var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

/*
 create or replace view company_view as
 select s.*, a.street, a.zip_code from company s
 join address a on a.address_id = s.address_id;

 */

exports.getAll = function(callback) {
    var query = 'SELECT * FROM specialty;';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.getById = function(specialty_id, callback) {
    var query = 'SELECT * from specialty where specialty_id = ?';
    var queryData = [specialty_id];
    console.log(query);

    connection.query(query, queryData, function(err, result) {

        callback(err, result);
    });
};
/*
DROP PROCEDURE IF EXISTS accounts_getinfo;
DELIMITER //
CREATE PROCEDURE accounts_getinfo(_account_id int)
BEGIN

SELECT * FROM account a WHERE a.account_id = _account_id;

SELECT c.company_name FROM account_company a_c
JOIN company c ON c.company_id = a_c.company_id
WHERE a_c.account_id = _account_id;

SELECT a_sc.*, s.school_Name FROM account_school a_sc
JOIN school s ON s.school_id=a_sc.school_id
WHERE a_sc.account_id = _account_id;

SELECT a_sk.*, sk.skill_name FROM account_skill a_sk
JOIN skill sk ON sk.skill_id=a_sk.skill_id
WHERE a_sk.account_id = _account_id;

END //
DELIMITER ;
 */

exports.insert = function(params, callback) {
    // FIRST INSERT THE COMPANY
    var query = 'INSERT INTO specialty (specialty_name, description) VALUES (?, ?)';

    var queryData = [params.specialty_name, params.description];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

exports.delete = function(specialty_id, callback) {
    var query = 'DELETE FROM specialty WHERE specialty_id = ?';
    var queryData = [specialty_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

exports.update = function(params, callback) {
    var query = 'UPDATE specialty SET specialty_name = ?, description = ? WHERE specialty_id = ?';
    var queryData = [params.specialty_name, params.description, params.specialty_id];

    connection.query(query, queryData, function (err, result) {
        callback(err, result);
    });
}



exports.edit = function(specialty_id, callback) {
    var query = 'select * from specialty where specialty_id = ?';
    var queryData = [specialty_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

