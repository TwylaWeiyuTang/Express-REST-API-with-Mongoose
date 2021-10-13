const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Dishes = require('../models/dishes');

const dishRouter = express.Router(); // this will declare dishRouter as an Express router

dishRouter.use(bodyParser.json());

dishRouter.route('/')
// dishRouter.route means we are declaring the endpoint at one single location,
// whereby you can chain all the GET, POST, PUT, DELETE method to this router

.get((req,res,next) => { // res here is modified res
    Dishes.find({})
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req,res,next) => {
    Dishes.create(req.body)
    .then((dish) => {
        console.log('Dish Created ', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
.delete((req,res,next) => { // res here is modified res
    Dishes.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp); // return the response to the client side
    }, (err) => next(err))
    .catch((err) => next(err));
}) // this means the client wants to delete all the dishes information from the server side
// this is a chain of GET,POST,PUT DELETE MESSAGE


dishRouter.route('/:dishId')
.get((req,res,next) => { // res here is modified res
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post((req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/' + req.params.dishId);
    // because for a specific dish page, we can't post any new dish inside, we can only modify
    // the current dish
})

.put((req,res,next) => {
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body},
        {new: true})
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.delete((req,res,next) => { // res here is modified res
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
}); // this means the client wants to delete all the dishes information from the server side

module.exports = dishRouter;