const mongoose = require('mongoose');
const Event = require('../models/Event');
const { env } = require('../config/environment');

class RSVPController {
  async rsvpToEvent(req, res) {
    try {
      const eventId = req.params.id;
      const userId = req.user.userId;
      
      if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(400).json({ message: 'Invalid event ID format' });
      }
      
      console.log(`\n🎫 RSVP Request: User ${userId} → Event ${eventId}`);
      
      const updatedEvent = await Event.findOneAndUpdate(
        {
          _id: eventId,
          attendees: { $ne: userId },
          $expr: { $lt: [{ $size: '$attendees' }, '$capacity'] }
        },
        { 
          $push: { attendees: userId }
        },
        { 
          new: true,
          runValidators: true
        }
      ).populate('organizer', 'name email');
      
      if (!updatedEvent) {
        console.log('❌ RSVP failed - checking reason...');
        
        const event = await Event.findById(eventId);
        
        if (!event) {
          console.log('❌ Event not found');
          return res.status(404).json({ message: 'Event not found' });
        }
        
        if (event.attendees.includes(userId)) {
          console.log('❌ User already RSVP\'d');
          return res.status(400).json({ 
            message: 'You have already RSVPed to this event' 
          });
        }
        
        if (event.attendees.length >= event.capacity) {
          console.log('❌ Event at full capacity');
          return res.status(400).json({ 
            message: 'Event is at full capacity',
            capacity: event.capacity,
            currentAttendees: event.attendees.length
          });
        }
        
        return res.status(400).json({ message: 'RSVP failed. Please try again.' });
      }
      
      const spotsRemaining = updatedEvent.capacity - updatedEvent.attendees.length;
      console.log(`✅ RSVP successful! Spots remaining: ${spotsRemaining}`);
      
      res.json({
        message: 'RSVP successful',
        event: updatedEvent,
        spotsRemaining
      });
      
    } catch (error) {
      console.error('❌ RSVP error:', error);
      res.status(500).json({ 
        message: 'Server error processing RSVP',
        error: env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  async cancelRSVP(req, res) {
    try {
      const eventId = req.params.id;
      const userId = req.user.userId;
      
      if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(400).json({ message: 'Invalid event ID format' });
      }
      
      console.log(`\n🚫 Cancel RSVP: User ${userId} → Event ${eventId}`);
      
      const event = await Event.findByIdAndUpdate(
        eventId,
        { $pull: { attendees: userId } },
        { new: true }
      ).populate('organizer', 'name email');
      
      if (!event) {
        console.log('❌ Event not found');
        return res.status(404).json({ message: 'Event not found' });
      }
      
      console.log('✅ RSVP cancelled successfully');
      
      res.json({
        message: 'RSVP cancelled successfully',
        event
      });
    } catch (error) {
      console.error('❌ Cancel RSVP error:', error);
      res.status(500).json({ 
        message: 'Server error cancelling RSVP',
        error: env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new RSVPController();