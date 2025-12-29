const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: String, required: true },
  capacity: { type: Number, required: true },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  category: { type: String, required: true },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

// Indexes for performance
eventSchema.index({ date: 1, category: 1 });
eventSchema.index({ organizer: 1 });
eventSchema.index({ attendees: 1 });

module.exports = mongoose.model('Event', eventSchema);