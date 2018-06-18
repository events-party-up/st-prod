const mongoose = require('mongoose');

const LocationSchema = mongoose.Schema({
  city: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  }
});

const Location = module.exports = mongoose.model('Location', LocationSchema);

module.exports.getById = function(id, callback) {
  Location.findById(id, callback);
}

module.exports.getAll = function(callback) {
  Location.find(callback);
}

module.exports.create = function(newLocation, callback) {
  newLocation.save(callback);
}

module.exports.delete = function(id, callback) {
  Location.findByIdAndRemove(id, callback);
}

module.exports.update = function(location, callback) {
  Location.findByIdAndUpdate(location._id, { $set: location }, { new: true }, callback);
}