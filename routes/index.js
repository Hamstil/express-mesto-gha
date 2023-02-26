const routes = require('express').Router();
const { userRoutes } = require('./users');

routes.use('/users', userRoutes);

exports.routes = routes;