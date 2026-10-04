const express = require('express');

const {
  getProfile,
  updateProfile,
  updateAvatar,
} = require('../controllers/userController');

const authMiddleware =
  require('../middlewares/authMiddleware');

const uploadAvatar =
  require('../middlewares/uploadAvatar');

const router = express.Router();

router.get(
  '/me',
  authMiddleware,
  getProfile
);

router.patch(
  '/me',
  authMiddleware,
  updateProfile
);

router.patch(
  '/me/avatar',
  authMiddleware,
  uploadAvatar.single('avatar'),
  updateAvatar
);

module.exports = router;