/**
 * Created by jtpal on 11/10/2016.
 */
var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

exports.getAll = function(callback) {
    var query = 'SELECT * FROM account_view;';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.getById = function(resume_id, callback) {
    var query = 'SELECT * FROM account_view WHERE resume_id = ?';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};


exports.insert = function(params, callback) {

    var query = 'INSERT INTO resume (user_account_id, resume_name) VALUES (?,?)';

    var queryData = [params.account_id, params.resume_name];

    connection.query(query, queryData, function (err, result) {

        var resume_id = result.insertID;

        var query = 'INSERT INTO (resume_id, account_id) VALUES ?';

        var resumeAccountData = [];

        for (var i = 0; i < params.account_id.length; i++) {
            resumeAccountData.push([resume_id, params.account_id[i]]);
        }
        connection.query(query, [resumeAccountData], function (err, result) {
            callback(err, result);
        });
    });
};

exports.delete = function(resume_id, callback) {
        var query = 'DELETE FROM resume WHERE resume_id = ?';

        var queryData = [resume_id];

        connection.query(query, queryData, function(err, result) {
            callback(err, result);
        });

};

//declare the function so it can be used locally
var resumeAccountInsert = function(resume_id, accountIdArray, callback){
    // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
    var query = 'INSERT INTO resume (resume_id) AND account (account_id) VALUES ?' ;

    // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
    var resumeAccountData = [];
    for(var i=0; i < accountIdArray.length; i++) {
        resumeAccountData.push([resume_id, accountIdArray[i]]);
    }
    connection.query(query, [resumeAccountData], function(err, result){
        callback(err, result);
    });
};
//export the same function so it can be used by external callers
module.exports.resumeAccountInsert = resumeAccountInsert;

//declare the function so it can be used locally
var resumeAccountDeleteAll = function(resume_id, callback){
    var query = 'DELETE FROM resume WHERE resume_id = ?';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};
//export the same function so it can be used by external callers
module.exports.resumeAccountDeleteAll = resumeAccountDeleteAll;

exports.update = function(params, callback) {
    var query = 'UPDATE resume SET resume_name = ? WHERE resume_id = ?';

    var queryData = [params.resume_name, params.resume_id];

    connection.query(query, queryData, function(err, result) {
        //delete company_address entries for this company
        resumeAccountDeleteAll(params.resume_id, function(err, result){

            if(params.account_id != null) {
                //insert company_address ids
                resumeAccountInsert(params.resume_id, params.account_id, function(err, result){
                    callback(err, result);
                });}
            else {
                callback(err, result);
            }
        });

    });
};

/*  Stored procedure used in this example
 DROP PROCEDURE IF EXISTS company_getinfo;
 DELIMITER //
 CREATE PROCEDURE company_getinfo (_company_id int)
 BEGIN
 SELECT * FROM company WHERE company_id = _company_id;
 SELECT a.*, s.company_id FROM address a
 LEFT JOIN company_address s on s.address_id = a.address_id AND company_id = _company_id
 ORDER BY a.street, a.zipcode;
 END //
 DELIMITER ;
 # Call the Stored Procedure
 CALL company_getinfo (4);
 */

exports.edit = function(resume_id, callback) {
    var query = 'CALL resume_getinfo(?)';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};