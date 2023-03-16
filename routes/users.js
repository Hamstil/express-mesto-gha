const express = require('express');

const userRoutes = express.Router();
const {
  getUsers,
  getUsersById,
  getCurrentUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');
const { validationUpdateUser, validationUpdateAvatar, validationUserId } = require('../middlewares/validation');

userRoutes.get('/', getUsers);
userRoutes.get('/me', getCurrentUser);
userRoutes.get('/:userId', validationUserId, getUsersById);
userRoutes.patch('/me', validationUpdateUser, updateUser);
userRoutes.patch('/me/avatar', validationUpdateAvatar, updateAvatar);

exports.userRoutes = userRoutes;
