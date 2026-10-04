const express = require('express');

const {
  getCategories,
  createCategory,
  deleteCategory,
} = require('../controllers/categoryController');

const authMiddleware =
  require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get(
  '/',
  getCategories
);

router.post(
  '/',
  createCategory
);

router.delete(
  '/:id',
  deleteCategory
);

module.exports = router;