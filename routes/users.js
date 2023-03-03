const express = require('express');

const userRoutes = express.Router();
const {
  getUsers,
  getUsersById,
  getCurrentUser,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

userRoutes.get('/', getUsers);
userRoutes.get('/me', getCurrentUser);
userRoutes.get('/:userId', getUsersById);
userRoutes.patch('/me', express.json(), updateUser);
userRoutes.patch('/me/avatar', express.json(), updateAvatar);
userRoutes.post('/', express.json(), createUser);

exports.userRoutes = userRoutes;
