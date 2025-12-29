const express = require('express');
const eventController = require('../controllers/eventController');
const rsvpController = require('../controllers/rsvpController');
const aiController = require('../controllers/aiController');
const { authenticateToken } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const router = express.Router();

router.post('/generate-description', authenticateToken, aiController.generateDescription);

// Event CRUD
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.post('/', authenticateToken, upload.single('image'), eventController.createEvent);
router.put('/:id', authenticateToken, upload.single('image'), eventController.updateEvent);
router.delete('/:id', authenticateToken, eventController.deleteEvent);

// RSVP
router.post('/:id/rsvp', authenticateToken, rsvpController.rsvpToEvent);
router.delete('/:id/rsvp', authenticateToken, rsvpController.cancelRSVP);

module.exports = router;