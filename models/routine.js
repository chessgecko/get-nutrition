// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var RoutineSchema   = new mongoose.Schema({
  name: String,
  //either weekly or rotation
  type: String,
  //array of workout ids
  workouts: [{id:String, day:String}],

  userId: String
});

// Export the Mongoose model
module.exports = mongoose.model('Routine', RoutineSchema);