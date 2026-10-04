const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const balanceController = require('../controllers/balanceController');

const router = express.Router();

router.use(authMiddleware);
router.get('/', balanceController.getBalance);
router.post('/adjustments', balanceController.createAdjustment);

module.exports = router;
