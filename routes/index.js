const { HTTP_STATUS_NOT_FOUND } = require('http2').constants;
const routes = require('express').Router();
const { cardRoutes } = require('./cards');
const { userRoutes } = require('./users');

routes.use('/users', userRoutes);
routes.use('/cards', cardRoutes);

// Ошибка на остальные роуты
routes.use((req, res, next) => {
  res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Такой страницы нет' });
  next();
});

exports.routes = routes;
