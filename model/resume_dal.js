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


exports.insert = function(params, callback){

    var query = 'INSERT INTO resume (user_account_id, resume_name) VALUES (?,?)';

    var queryData = [params.user_account_id_name, params.resume_name];

    connection.query(query, queryData, function(err, result){
        callback(err,result);
    });

    exports.delete = function(resume_id, callback) {
        var query = 'DELETE FROM resume WHERE resume_id = ?';

        var queryData = [resume_id];

        connection.query(query, queryData, function(err, result) {
            callback(err, result);
        });
    };
};