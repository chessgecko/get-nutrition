// Load required packages
var Routine = require('../models/routine');

// Create endpoint /api/beers for POST
exports.postRoutine = function(req, res) {
  // Create a new instance of the Beer model
  var routine = new Routine();

  // Set the beer properties that came from the POST data
  routine.name = req.body.name;
  routine.type = req.body.type;
  routine.workouts = req.body.workouts;
  routine.userId = req.user._id;

  // Save the beer and check for errors
  routine.save(function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'Routine added to the locker!', data: routine });
  });
};

// Create endpoint /api/routine for GET
exports.getRoutines = function(req, res) {
  // Use the Beer model to find all beer
  Routine.find({ userId: req.user._id }, function(err, routines) {
    if (err)
      res.send(err);

    res.json(routines);
  });
};

// Create endpoint /api/routine/:routine_id for GET
exports.getRoutine = function(req, res) {
  // Use the Routine model to find a specific routine
  Routine.find({ userId: req.user._id, _id: req.params.routine_id }, function(err, routine) {
    if (err)
      res.send(err);

    res.json(routine);
  });
};

// Create endpoint /api/routines/:routine_id for PUT
exports.addWorkoutToRoutine = function(req, res) {
  Routine.findOne({ userId: req.user._id, _id: req.params.routine_id }, function(err, routine) {
    if (err)
      res.send(err);
    if(!routine){
      res.json({message:"error not found"});
    }

    routine.workouts.push({id:req.body.workoutId, day: req.body.day});
    //routine.workouts = [];
    routine.markModified('workouts');
    routine.save();
    res.json(routine);
  });
};

exports.removeWorkoutFromRoutine = function(req, res) {
  Routine.findOne({ userId: req.user._id, _id: req.params.routine_id }, function(err, routine) {
    if (err)
      res.send(err);
    if(!routine){
      res.json({message:"error not found"});
    }

    var len = routine.workouts.length;

    for(var i = 0; i<len; i++){
      if(routine.workouts[i].id == req.body.workoutId && routine.workouts[i].day == req.body.day){
        routine.workouts.splice(i, 1);
        break;
      }
    }

    routine.markModified('workouts');
    routine.save();
    res.json(routine);
  });
};

// Create endpoint /api/routines/:routine_id for DELETE
exports.deleteRoutine = function(req, res) {
  // Use the Beer model to find a specific beer and remove it
  Routine.remove({ userId: req.user._id, _id: req.params.routine_id }, function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'Routine removed from the locker!' });
  });
};