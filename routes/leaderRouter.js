const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router(); // this will declare dishRouter as an Express router

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
// dishRouter.route means we are declaring the endpoint at one single location,
// whereby you can chain all the GET, POST, PUT, DELETE method to this router
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain'); // here we are modifying the res object
    next(); // the modification will be carried in the next request function
}) // app.all means the above code will be executed for all types of request(PUT,POST,DELETE,GET)
// then it will continue to next
.get((req,res,next) => { // res here is modified res
    res.end('Will send all the leaders to you!');
})
.post((req,res,next) => {
    res.end('Will add the leader: ' + req.body.name + 
        ' with details: ' + req.body.description);
        // bodyParser allows us to parse the incoming json request into a javascript object
        // that's why we are able to call the name and description property here
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
})
.delete((req,res,next) => { // res here is modified res
    res.end('Deleting all the leaders!');
}) // this means the client wants to delete all the dishes information from the server side
// this is a chain of GET,POST,PUT DELETE MESSAGE


leaderRouter.route('/:leaderId')

.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain'); // here we are modifying the res object
    next(); // the modification will be carried in the next request function
})
.get((req,res,next) => { // res here is modified res
    res.end('Will send details of the leader: '
        + req.params.leaderId + ' to you!');
})

.post((req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /leaders/' + req.params.leaderId);
    // because for a specific dish page, we can't post any new dish inside, we can only modify
    // the current dish
})

.put((req,res,next) => {
    res.write('Updating the leader ' + req.params.leaderId)
    res.end('Will update the leader: ' + req.body.name + ' with details: ' +
        req.body.description);
})

.delete((req,res,next) => { // res here is modified res
    res.end('Deleting leader: ' + req.params.leaderId);
}); // this means the client wants to delete all the dishes information from the server side

module.exports = leaderRouter;