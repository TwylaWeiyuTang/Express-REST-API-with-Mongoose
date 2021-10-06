const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router(); // this will declare dishRouter as an Express router

dishRouter.use(bodyParser.json());

dishRouter.route('/')
// dishRouter.route means we are declaring the endpoint at one single location,
// whereby you can chain all the GET, POST, PUT, DELETE method to this router
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain'); // here we are modifying the res object
    next(); // the modification will be carried in the next request function
}) // app.all means the above code will be executed for all types of request(PUT,POST,DELETE,GET)
// then it will continue to next
.get((req,res,next) => { // res here is modified res
    res.end('Will send all the dishes to you!');
})
.post((req,res,next) => {
    res.end('Will add the dish: ' + req.body.name + 
        ' with details: ' + req.body.description);
        // bodyParser allows us to parse the incoming json request into a javascript object
        // that's why we are able to call the name and description property here
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
.delete((req,res,next) => { // res here is modified res
    res.end('Deleting all the dishes!');
}) // this means the client wants to delete all the dishes information from the server side
// this is a chain of GET,POST,PUT DELETE MESSAGE


dishRouter.route('/:dishId')

.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain'); // here we are modifying the res object
    next(); // the modification will be carried in the next request function
})
.get((req,res,next) => { // res here is modified res
    res.end('Will send details of the dish: '
        + req.params.dishId + ' to you!');
})

.post((req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/' + req.params.dishId);
    // because for a specific dish page, we can't post any new dish inside, we can only modify
    // the current dish
})

.put((req,res,next) => {
    res.write('Updating the dish ' + req.params.dishId)
    res.end('Will update the dish: ' + req.body.name + ' with details: ' +
        req.body.description);
})

.delete((req,res,next) => { // res here is modified res
    res.end('Deleting dish: ' + req.params.dishId);
}); // this means the client wants to delete all the dishes information from the server side

module.exports = dishRouter;