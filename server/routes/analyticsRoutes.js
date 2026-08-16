const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// Pie Chart Route
router.get('/pie-chart', analyticsController.getPieChartStats);

// Experts Routes
router.get('/experts', analyticsController.getAllExperts);
router.post('/experts', analyticsController.createExpert);
router.delete('/experts/:id', analyticsController.deleteExpert);

module.exports = router;