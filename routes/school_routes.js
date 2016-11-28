var express = require('express');
var router = express.Router();
var school_dal = require('../model/school_dal');
var address_dal = require('../model/address_dal');

// View All schools
router.get('/all', function(req, res) {
    school_dal.getAll(function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('school/schoolViewAll', { 'result':result });
        }
    });

});

// View the school for the given id
router.get('/', function(req, res){
    if(req.query.school_id == null) {
        res.send('school_id is null');
    }
    else {
        school_dal.getById(req.query.school_id, function(err,result) {
           if (err) {
               res.send(err);
           }
           else {
               res.render('school/schoolViewById', {'result': result});
           }
        });
    }
});

//return the add a new school form
router.get('/add', function(req, res){
    address_dal.getAll(function(err,result) {
            if (err) {
                res.send(err);
            }
            else {
                res.render('school/schoolAdd', {'address': result});
            }
    });
});
router.get('/insert', function(req, res) {
    if(req.query.school_name == null) {
        res.send('School Name must be provided.');

    }
    else if (req.query.address_id == null) {
        res.send('Ann Address must be selected');
    }
    else{
        school_dal.insert(req.query, function(err, result){
            if (err){
                res.send(err);
            }
            else {
                res.redirect(302, '/school/all');
            }
        });
    }
});

//Delete a school for given ID
router.get('/delete', function(req,res) {
    if(req.query.school_id == null) {
        res.send('school_id is null');
    }
    else {
        school_dal.delete(req.query.school_id, function(err, result) {
            if(err) {
                res.send(err);
            }
            else {
                res.redirect(302, '/school/all');
            }
        });
    }
});

module.exports = router;
