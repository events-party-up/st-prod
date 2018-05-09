const mongoose = require('mongoose');

const EventSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  start_date: {
    type: String,
    required: true
  },
  end_date: {
    type: String,
    required: true
  },
  division: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Division'
  },
  location: {
    type: String,
  },
  head_judge: {
    type: String,
    required: true
  },
  host: {
    type: String,
    required: true
  }
});

const Event = module.exports = mongoose.model('Event', EventSchema);

module.exports.getById = function(id, callback) {
  Event.findById(id, callback)
  .populate({
    model: 'Division',
    path: 'division',
    populate: {
      path: 'league',
      model: 'League'
    }
  });
}

module.exports.getAll = function(callback) {
  Event.find(callback)
    .populate({
      model: 'Division',
      path: 'division'
    });
}

module.exports.create = function(newEvent, callback) {
  newEvent.save(callback);
}

module.exports.delete = function(id, callback) {
  Event.findByIdAndRemove(id, callback);
}

module.exports.update = function(event, callback) {
  Event.findByIdAndUpdate(event._id, { $set: event }, { new: true }, callback);
}
