const express = require('express');

const userRoutes = express.Router();
const { getUsers, getUsersById, createUser } = require('../controllers/users');

userRoutes.get('/', getUsers);
userRoutes.get('/:id', getUsersById);
userRoutes.post('/', express.json(), createUser);

exports.userRoutes = userRoutes;
