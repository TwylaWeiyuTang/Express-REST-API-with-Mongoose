const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Promotions = require('../models/promotions');

const promoRouter = express.Router(); // this will declare dishRouter as an Express router

promoRouter.use(bodyParser.json());

promoRouter.route('/')
.get((req,res,next) => { // res here is modified res
    Promotions.find({})
    .then((promo) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promo);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req,res,next) => {
    Promotions.create(req.body)
    .then((promo) => {
        console.log('Promotion Created ', promo);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promo);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete((req,res,next) => { // res here is modified res
    Promotions.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp); // return the response to the client side
    }, (err) => next(err))
    .catch((err) => next(err));
}) // this means the client wants to delete all the dishes information from the server side
// this is a chain of GET,POST,PUT DELETE MESSAGE


promoRouter.route('/:promoId')
.get((req,res,next) => { // res here is modified res
    Promotions.findById(req.params.promoId)
    .then((promo) => {
        res.statusCode = 200;
        res.setHeader ('Content-Type', 'application/json');
        res.json(promo);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post((req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /promotions/' + req.params.promoId);
    // because for a specific dish page, we can't post any new dish inside, we can only modify
    // the current dish
})

.put((req,res,next) => {
    Promotions.findByIdAndUpdate(req.params.promoId, {
        $set: req.body},
        {new: true})
    .then((promo) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promo);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.delete((req,res,next) => { // res here is modified res
    Promotions.findByIdAndRemove(req.params.promoId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
}); // this means the client wants to delete all the dishes information from the server side

module.exports = promoRouter;