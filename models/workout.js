// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var WorkoutSchema   = new mongoose.Schema({
  name: String,
  exercises: [String],
  userId: String
});

// Export the Mongoose model
module.exports = mongoose.model('Workout', WorkoutSchema);