/**
 * Created by jtpal on 11/9/2016.
 */
var express = require('express');
var router = express.Router();
var resume_dal = require('../model/resume_dal');
var account_dal = require('../model/account_dal');


// View All resumes
router.get('/all', function(req, res) {
    resume_dal.getAll(function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('resume/resumeViewAll', { 'result':result });
        }
    });

});

// View the account for the given id
router.get('/', function(req, res){
    if(req.query.resume_id == null) {
        res.send('resume_id is null');
    }
    else {
        resume_dal.getById(req.query.resume_id, function(err,result) {
            if (err) {
                res.send(err);
            }
            else {
                res.render('resume/resumeViewById', {'result': result});
            }
        });
    }
});

//return the add a new school form
router.get('/add', function(req, res){
    account_dal.getAll(function(err,result) {
        if (err) {
            res.send(err);
        }
        else {
            res.render('resume/resumeAdd', {'account': result});
        }
    });
});
router.get('/insert', function(req, res) {
    if(req.query.resume_name == null) {
        res.send('Resume Name must be provided.');

    }
    else if (req.query.address_id == null) {
        res.send('An Acount name must be selected');
    }
    else{
        resume_dal.insert(req.query, function(err, result){
            if (err){
                res.send(err);
            }
            else {
                res.redirect(302, '/resume/all');
            }
        });
    }
});

//Delete a school for given ID
router.get('/delete', function(req,res) {
    if(req.query._id == null) {
        res.send('resume_id is null');
    }
    else {
        resume_dal.delete(req.query.resume_id, function(err, result) {
            if(err) {
                res.send(err);
            }
            else {
                res.redirect(302, '/resume/all');
            }
        });
    }
});

module.exports = router;