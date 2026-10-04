const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const statController = require('../controllers/statController');

const router = express.Router();

router.use(authMiddleware);
router.get('/metrics', statController.getStatMetrics);
router.get('/chart-flow', statController.getFlowChartData);
router.get('/top-expenses', statController.getTopExpenses);

module.exports = router;
