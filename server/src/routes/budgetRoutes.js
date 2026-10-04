const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const authenticateToken = require('../middlewares/authMiddleware');

router.use(authenticateToken);

router.get('/', budgetController.getBudgets);
router.post('/', budgetController.upsertBudget);

module.exports = router;