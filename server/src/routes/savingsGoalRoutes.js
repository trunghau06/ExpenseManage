const express = require('express');
const router = express.Router();
const savingsGoalController = require('../controllers/savingsGoalController');
const authenticateToken = require('../middlewares/authMiddleware');

router.use(authenticateToken);

router.get('/', savingsGoalController.getSavingsGoal);
router.post('/', savingsGoalController.upsertSavingsGoal);

module.exports = router;