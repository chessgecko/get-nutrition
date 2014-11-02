// Load required packages
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var routineController = require('./controllers/routine');
var workoutController = require('./controllers/workout');
var userController = require('./controllers/user');
var authController = require('./controllers/auth');

// Connect to the beerlocker MongoDB
mongoose.connect('mongodb://musclemetrics:davidhelom@ds041150.mongolab.com:41150/musclemetricsdb');

// Create our Express application
var app = express();

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}));

// Use the passport package in our application
app.use(passport.initialize());

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
.post(authController.isAuthenticated, routineController.postRoutine)
.get(authController.isAuthenticated, routineController.getRoutines);

// Create endpoint handlers for /beers/:beer_id
router.route('/routine/:routine_id')
.get(authController.isAuthenticated, routineController.getRoutine)
.delete(authController.isAuthenticated, routineController.deleteRoutine);

router.route('/routine/removeworkout/:routine_id')
.put(authController.isAuthenticated, routineController.removeWorkoutFromRoutine);

router.route('/routine/addworkout/:routine_id')
.put(authController.isAuthenticated, routineController.addWorkoutToRoutine);



router.route('/workout')
.post(authController.isAuthenticated, workoutController.postWorkout)
.get(authController.isAuthenticated, workoutController.getWorkouts);

router.route('/workout/:workout_id')
.get(authController.isAuthenticated, workoutController.getWorkout)
.put(authController.isAuthenticated, workoutController.putWorkout)
.delete(authController.isAuthenticated, workoutController.deleteWorkout);

router.route('/workout/addexercise/:workout_id');





// Create endpoint handlers for /users
router.route('/users')
.post(userController.postUsers)
.get(authController.isAuthenticated, userController.getUsers);

// Register all our routes with /api
app.use('/api', router);
var port = process.env.PORT || 3000;
// Start the server
app.listen(port);
console.log('the magic happens on port ' + port);
