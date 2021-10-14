const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Leaders = require('../models/leaders');

const leaderRouter = express.Router(); // this will declare dishRouter as an Express router

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.get((req,res,next) => { // res here is modified res
    Leaders.find({})
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req,res,next) => {
    Leaders.create(req.body)
    .then((leader) => {
        console.log('Leader Created ', leader);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
})
.delete((req,res,next) => { // res here is modified res
    Leaders.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp); // return the response to the client side
    }, (err) => next(err))
    .catch((err) => next(err));
}) // this means the client wants to delete all the dishes information from the server side
// this is a chain of GET,POST,PUT DELETE MESSAGE


leaderRouter.route('/:leaderId')
.get((req,res,next) => { // res here is modified res
    Leaders.findById(req.params.leaderId)
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader ('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post((req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /leaders/' + req.params.leaderId);
    // because for a specific dish page, we can't post any new dish inside, we can only modify
    // the current dish
})

.put((req,res,next) => {
    Leaders.findByIdAndUpdate(req.params.leaderId, {
        $set: req.body},
        {new: true})
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.delete((req,res,next) => { // res here is modified res
    Leaders.findByIdAndRemove(req.params.leaderId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
}); // this means the client wants to delete all the dishes information from the server side

module.exports = leaderRouter;