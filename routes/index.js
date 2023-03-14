const { HTTP_STATUS_NOT_FOUND } = require('http2').constants;
const express = require('express');

const routes = express.Router();
const { createUser, login } = require('../controllers/auth');
const { auth } = require('../middlewares/auth');
const { cardRoutes } = require('./cards');
const { userRoutes } = require('./users');

routes.post('/signin', login);
routes.post('/signup', createUser);

routes.use('/users', auth, userRoutes);
routes.use('/cards', auth, cardRoutes);

// Ошибка на остальные роуты
routes.use((req, res, next) => {
  res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Такой страницы нет' });
  next();
});

exports.routes = routes;
