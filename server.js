// Load required packages
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var routineController = require('./controllers/routine');
var workoutController = require('./controllers/workout');
var foodController = require('./controllers/food');

var http = require('http');
var request = require('request');
var async = require('async');
var parseString = require('xml2js').parseString;


// Connect to the beerlocker MongoDB
mongoose.connect('mongodb://musclemetrics:davidhelom@ds041150.mongolab.com:41150/musclemetricsdb');

// Create our Express application
var app = express();

app.set("view engine", "ejs");

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}));


// Add headers
app.use(function (req, res, next) {
  //console.log("here");
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Authorization");


    // Pass to next layer of middleware
    next();
  });

// Create our Express router
var router = express.Router();

// Create endpoint handlers for /beers
router.route('/routine')
.post(routineController.postRoutine)
.get(routineController.getRoutines);

router.route('/').get(function(req,res){
	res.render("pages/index");
});

router.route('/food')
.post(foodController.getFoods);

// Create endpoint handlers for /beers/:beer_id
router.route('/routine/:routine_id')
.get(routineController.getRoutine)
.delete( routineController.deleteRoutine);

router.route('/routine/removeworkout/:routine_id')
.put(routineController.removeWorkoutFromRoutine);

router.route('/routine/addworkout/:routine_id')
.put(routineController.addWorkoutToRoutine);



router.route('/workout')
.post(workoutController.postWorkout)
.get(workoutController.getWorkouts);

router.route('/workout/:workout_id')
.get(workoutController.getWorkout)
.put(workoutController.putWorkout)
.delete(workoutController.deleteWorkout);

router.route('/workout/addexercise/:workout_id');

// Register all our routes with /api
app.use('/', router);
var port = process.env.PORT || 3000;
// Start the server
app.listen(port);
console.log('the magic happens on port ' + port);
