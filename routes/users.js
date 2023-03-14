const express = require('express');

const userRoutes = express.Router();
const {
  getUsers,
  getUsersById,
  getCurrentUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

userRoutes.get('/', getUsers);
userRoutes.get('/me', getCurrentUser);
userRoutes.get('/:userId', getUsersById);
userRoutes.patch('/me', express.json(), updateUser);
userRoutes.patch('/me/avatar', express.json(), updateAvatar);

exports.userRoutes = userRoutes;
