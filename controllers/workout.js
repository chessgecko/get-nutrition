// Load required packages
var Workout = require('../models/workout');

// Create endpoint /api/beers for POST
exports.postWorkout = function(req, res) {
  // Create a new instance of the Beer model
  var workout = new Workout();

  // Set the beer properties that came from the POST data
  workout.name = req.body.name;
  workout.exercises = req.body.exercises;
  workout.userId = req.user._id;

  // Save the beer and check for errors
  workout.save(function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'Workout added to the locker!', data: workout });
  });
};

// Create endpoint /api/routine for GET
exports.getWorkouts = function(req, res) {
  // Use the Beer model to find all beer
  Workout.find({ userId: req.user._id }, function(err, workouts) {
    if (err)
      res.send(err);

    res.json(workouts);
  });
};

// Create endpoint /api/routine/:routine_id for GET
exports.getWorkout = function(req, res) {
  // Use the Routine model to find a specific routine
  Workout.find({ userId: req.user._id, _id: req.params.workout_id }, function(err, workout) {
    if (err)
      res.send(err);

    res.json(workout);
  });
};

// Create endpoint /api/routines/:routine_id for PUT
exports.putWorkout = function(req, res) {
  // Use the Beer model to find a specific beer
  Workout.find({ userId: req.user._id, _id: req.params.workout_id }, function(err, workout) {
    if (err)
      res.send(err);

    workout.exercises.push(req.exercises);

    res.json({ message: 'exercises added to ' + workout.name + '.' });
  });
};

// Create endpoint /api/routines/:routine_id for DELETE
exports.deleteWorkout = function(req, res) {
  // Use the Beer model to find a specific beer and remove it
  Workout.remove({ userId: req.user._id, _id: req.params.workout_id }, function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'Routine removed from the locker!' });
  });
};
