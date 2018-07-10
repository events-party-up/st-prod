const mongoose = require('mongoose');

const EventSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  division: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Division'
  }],
  tournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament'
  },
  type: String,
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

