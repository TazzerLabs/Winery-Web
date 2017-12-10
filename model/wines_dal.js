// Send Help...
var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

/*
 create or replace view wines_view as
 select s.*, a.street, a.zip_code from wines s
 join wineries a on a.wineries_id = s.wineries_id;

 */

exports.getAll = function(callback) {
    var query = 'SELECT * FROM wines;';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.getById = function(wines_id, callback) {
    var query = 'SELECT w.*, ws.name FROM wines w ' +
        'LEFT JOIN wineries_wine ww on ww.wines_id = w.wines_id ' +
        'LEFT JOIN wineries ws on ws.wineries_id = ww.wineries_id ' +
        'WHERE w.wines_id = ?';
    var queryData = [wines_id];
    console.log(query);

    connection.query(query, queryData, function(err, result) {

        callback(err, result);
    });
};

exports.insert = function(params, callback) {

    // FIRST INSERT THE wines
    var query = 'INSERT INTO wines (wines_name, wines_age, vine_age, grape_blend, color_of_wine, amount_made, amount_sold, wineries_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

    var queryData = [params.wines_name, params.wines_age, params.vine_age, params.grape_blend, params.color_of_wine, params.amount_made, params.amount_sold, params.wineries_id];

    connection.query(query, queryData, function(err, result) {

        // THEN USE THE wines_ID RETURNED AS insertId AND THE SELECTED wineries_IDs INTO wineries_wine
        var wines_id = result.insertId;

        // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
        var query = 'INSERT INTO wineries_wine (wines_id, wineries_id) VALUES ?';

        // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
        var wineswineriesData = [];
        if (params.wineries_id.constructor === Array) {
            for (var i = 0; i < params.wineries_id.length; i++) {
                wineswineriesData.push([wines_id, params.wineries_id[i]]);
            }
        }
        else {
            wineswineriesData.push([wines_id, params.wineries_id]);
        }

        // NOTE THE EXTRA [] AROUND wineswineriesData
        connection.query(query, [wineswineriesData], function(err, result){
            callback(err, wines_id);
        });
    });

};

exports.delete = function(wines_id, callback) {
    var query = 'DELETE FROM wines WHERE wines_id = ?';
    var queryData = [wines_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });

};

//declare the function so it can be used locally
var wineswineriesInsert = function(wines_id, wineriesIdArray, callback){
    // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
    var query = 'INSERT INTO wineries_wine (wines_id, wineries_id) VALUES ?';

    // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
    var wineswineriesData = [];
    if (wineriesIdArray.constructor === Array) {
        for (var i = 0; i < wineriesIdArray.length; i++) {
            wineswineriesData.push([wines_id, wineriesIdArray[i]]);
        }
    }
    else {
        wineswineriesData.push([wines_id, wineriesIdArray]);
    }
    connection.query(query, [wineswineriesData], function(err, result){
        callback(err, result);
    });
};
//export the same function so it can be used by external callers
module.exports.wineswineriesInsert = wineswineriesInsert;

//declare the function so it can be used locally
var wineswineriesDeleteAll = function(wines_id, callback){
    var query = 'DELETE FROM wineries_wine WHERE wines_id = ?';
    var queryData = [wines_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};
//export the same function so it can be used by external callers
module.exports.wineswineriesDeleteAll = wineswineriesDeleteAll;

exports.update = function(params, callback) {
    var query = 'UPDATE wines SET wines_name = ?, wines_age = ?, vine_age = ?, grape_blend = ?, color_of_wine = ?, amount_made = ?, amount_sold = ?, wineries_id WHERE wines_id = ?';
    var queryData = [params.wines_name, params.wines_age, params.vine_age, params.grape_blend, params.color_of_wine, params.amount_made, params.amount_sold, params.wineries_id, params.wines_id];

    connection.query(query, queryData, function(err, result) {
        //delete wineries_wine entries for this wines
        wineswineriesDeleteAll(params.wines_id, function(err, result){

            if(params.wineries_id != null) {
                //insert wineries_wine ids
                wineswineriesInsert(params.wines_id, params.wineries_id, function(err, result){
                    callback(err, result);
                });}
            else {
                callback(err, result);
            }
        });

    });
};

// NEED TO HAVE AN UPDATE FOR THE companies, location, and specialty

/*  Stored procedure used in this example
     DROP PROCEDURE IF EXISTS wines_getinfo;

     DELIMITER //
     CREATE PROCEDURE wines_getinfo (wines_id int)
     BEGIN

     SELECT * FROM wines WHERE wines_id = _wines_id;

     SELECT a.*, s.wines_id FROM wineries a
     LEFT JOIN wineries_wine s on s.wineries_id = a.wineries_id AND wines_id = _wines_id;

     END //
     DELIMITER ;

     # Call the Stored Procedure
     CALL wines_getinfo (4);

 */

exports.edit = function(wines_id, callback) {
    var query = 'CALL wines_getinfo(?)';
    var queryData = [wines_id];

    connection.query(query, queryData, function(err, result)
    {
        if (err)
            callback(err, result);
        else
        {
            var winesData =
                {
                    'wines': result[0],
                    'wineries': result[1]
                };
            var query = 'CALL all_wineries()';
            connection.query(query, null, function(err, result) {
                winesData.wineries = result[0];
                callback(err, winesData);
            });
        }
    });
};
