const mongoose = require('mongoose');
const Event = require('../models/Event');
const { env } = require('../config/environment');

class EventController {
  async getAllEvents(req, res) {
    try {
      const { search, category, page = 1, limit = 12 } = req.query;
      
      let query = {};
      
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
      
      if (category && category !== 'All') {
        query.category = category;
      }
      
      const events = await Event.find(query)
        .populate('organizer', 'name email')
        .sort({ date: 1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit));
      
      const count = await Event.countDocuments(query);
      
      res.json({
        events,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        totalEvents: count
      });
    } catch (error) {
      console.error('Get all events error:', error);
      res.status(500).json({ 
        message: 'Server error fetching events',
        error: env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  async getEventById(req, res) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid event ID format' });
      }

      const event = await Event.findById(req.params.id)
        .populate('organizer', 'name email')
        .populate('attendees', 'name email');
      
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      res.json(event);
    } catch (error) {
      console.error('Get event error:', error);
      res.status(500).json({ message: 'Server error fetching event' });
    }
  }

  async createEvent(req, res) {
    try {
      console.log('\n📝 CREATE EVENT REQUEST:');
      console.log('User:', req.user?.userId);
      
      const { title, description, date, time, location, capacity, category } = req.body;
      
      const validationErrors = [];
      if (!title) validationErrors.push('title');
      if (!description) validationErrors.push('description');
      if (!date) validationErrors.push('date');
      if (!time) validationErrors.push('time');
      if (!location) validationErrors.push('location');
      if (!capacity) validationErrors.push('capacity');
      if (!category) validationErrors.push('category');
      
      if (validationErrors.length > 0) {
        console.error('❌ Missing fields:', validationErrors);
        return res.status(400).json({ 
          message: 'Missing required fields',
          missing: validationErrors
        });
      }
      
      if (!req.file) {
        console.error('❌ No image file uploaded');
        return res.status(400).json({ message: 'Event image is required' });
      }
      
      const event = new Event({
        title,
        description,
        date: new Date(date),
        time,
        location,
        image: req.file.path,
        capacity: parseInt(capacity),
        category,
        organizer: req.user.userId,
        attendees: []
      });
      
      await event.save();
      await event.populate('organizer', 'name email');
      
      res.status(201).json({
        message: 'Event created successfully',
        event
      });
    } catch (error) {
      console.error('Create event error:', error);
      res.status(500).json({ 
        message: 'Server error creating event',
        error: env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  async updateEvent(req, res) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid event ID format' });
      }

      const event = await Event.findById(req.params.id);
      
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      if (event.organizer.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'Not authorized to update this event' });
      }
      
      const { title, description, date, time, location, capacity, category } = req.body;
      
      if (title) event.title = title;
      if (description) event.description = description;
      if (date) event.date = new Date(date);
      if (time) event.time = time;
      if (location) event.location = location;
      if (capacity) event.capacity = parseInt(capacity);
      if (category) event.category = category;
      if (req.file) event.image = req.file.path;
      
      await event.save();
      await event.populate('organizer', 'name email');
      
      res.json({
        message: 'Event updated successfully',
        event
      });
    } catch (error) {
      console.error('Update event error:', error);
      res.status(500).json({ 
        message: 'Server error updating event',
        error: env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  async deleteEvent(req, res) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid event ID format' });
      }

      const event = await Event.findById(req.params.id);
      
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      if (event.organizer.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'Not authorized to delete this event' });
      }
      
      await Event.findByIdAndDelete(req.params.id);
      
      res.json({ message: 'Event deleted successfully' });
    } catch (error) {
      console.error('Delete event error:', error);
      res.status(500).json({ 
        message: 'Server error deleting event',
        error: env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  async getUserEvents(req, res) {
    try {
      const userId = req.user.userId;
      
      const createdEvents = await Event.find({ organizer: userId })
        .populate('organizer', 'name email')
        .sort({ date: 1 });
      
      const attendingEvents = await Event.find({ attendees: userId })
        .populate('organizer', 'name email')
        .sort({ date: 1 });
      
      res.json({
        created: createdEvents,
        attending: attendingEvents
      });
    } catch (error) {
      console.error('Get user events error:', error);
      res.status(500).json({ 
        message: 'Server error fetching user events',
        error: env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new EventController();