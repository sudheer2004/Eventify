const express = require('express');
const eventController = require('../controllers/eventController');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

router.get('/events', authenticateToken, eventController.getUserEvents);

module.exports = router;