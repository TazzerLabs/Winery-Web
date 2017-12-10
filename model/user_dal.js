var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

/*
 create or replace view company_view as
 select s.*, a.street, a.zip_code from company s
 join address a on a.address_id = s.address_id;

 */

exports.getAll = function(wines_id, callback) {
    var query = 'SELECT wines_name, amount_made, SUM(amount_made - amount_sold) AS TotalWine, ' +
    'name, symbol, specialty_name, description, CONCAT(street, ", ", zip_code) AS Wlocation ' +
    'FROM wines w JOIN wineries wr ON wr.wineries_id = w.wineries_id ' +
    'JOIN wineries_specialty ws ON ws.wineries_id = wr.wineries_id ' +
    'JOIN specialty s ON s.specialty_id = ws.specialty_id ' +
    'JOIN wineries_location wl ON wl.wineries_id = wr.wineries_id ' +
    'JOIN location l ON l.location_id = wl.location_id ' +
    'GROUP BY w.wines_id HAVING w.wines_id = ?';

    var queryData = [wines_id];
    console.log(query);

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};