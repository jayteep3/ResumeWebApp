/**
 * Created by jtpal on 11/9/2016.
 */

var express = require('express');
var router = express.Router();
var company_dal = require('../model/company_dal');
var address_dal = require('../model/address_dal');

// View All companys
router.get('/all', function(req, res) {
    company_dal.getAll(function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('company/companyViewAll', { 'result':result });
        }
    });

});

// View the company for the given id
router.get('/', function(req, res){
    if(req.query.company_id == null) {
        res.send('company_id is null');
    }
    else {
        company_dal.getById(req.query.company_id, function(err,result) {
            if (err) {
                res.send(err);
            }
            else {
                res.render('company/companyViewById', {'result': result});
            }
        });
    }
});

// Return the add a new company form
router.get('/add', function(req, res){
    address_dal.getAll(function(err,result) {
        if(err) {
            res.send(err);
        }
        else {
            res.render('company/companyAdd', {'address': result});
        }
    });
});

// insert a company record
router.get('/insert', function(req, res){
    // simple validation
    if(req.query.company_name == null) {
        res.send('Company Name must be provided.');
    }
    else if(req.query.address_id == null) {
        res.send('Need to select at least 1 address');
    }
    else {
        // passing all the query parameters (req.query) to the insert function instead of each individually
        company_dal.insert(req.query, function(err,result) {
            if (err) {
                res.send(err);
            }
            else {
                //poor practice, but we will handle it differently once we start using Ajax
                res.redirect(302, '/company/all');
            }
        });
    }
});
//edit a record
router.get('/edit', function(req,res){
    if(req.query.company_id == null){
        res.send('Need a company ID');
    }
    else {
        company_dal.edit(req.query.company_id, function(err, result){
            res.render('company/companyUpdate', {company: result[0][0], address: result[1]});
        });
    }
});

router.get('/edit2', function(req,res){
    if(req.query.company_id == null) {
        res.send('Need a company ID');
    }
    else {
        company_dal.getById(req.query.company_id, function(err, company){
            address_dal.getAll(function(err, address) {
                res.render('/company/companyUpdate', {company: company[0], address: address});
            });
        });
    }
});

//update a company
router.get('/update', function(req, res){
    company_dal.update(req.query, function(err,result){
        res.redirect(302, '/company/all');
    });
});

// Delete a company for the given company_id
router.get('/delete', function(req, res){
    if(req.query.company_id == null) {
        res.send('company_id is null');
    }
    else {
        company_dal.delete(req.query.company_id, function(err, result){
            if(err) {
                res.send(err);
            }
            else {
                //poor practice, but we will handle it differently once we start using Ajax
                res.redirect(302, '/company/all');
            }
        });
    }
});


module.exports = router;