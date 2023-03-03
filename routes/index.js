const routes = require('express').Router();
const { cardRoutes } = require('./cards');
const { userRoutes } = require('./users');

routes.use('/users', userRoutes);
routes.use('/cards', cardRoutes);

// Ошибка на остальные роуты
routes.use((req, res, next) => {
  res.status(404).send({ message: 'Такой страницы нет' });
  next();
});

exports.routes = routes;
