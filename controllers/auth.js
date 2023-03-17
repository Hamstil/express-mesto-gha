const { HTTP_STATUS_OK } = require('http2').constants;
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const { userSchema } = require('../models/user');
const BadRequest = require('../errors/BadRequest'); // 400
const ConflictError = require('../errors/ConflictError'); // 409
const AuthError = require('../errors/AuthError'); // 401

// Регистрация пользователя
exports.createUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await userSchema.create({
      name, about, avatar, email, password: hash,
    });
    res.status(HTTP_STATUS_OK).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      _id: user._id,
    });
  } catch (err) {
    if (err.code === 11000) {
      next(new ConflictError('Пользователь с таким email уже есть'));
    } else if (err.name === 'ValidationError') {
      const { message } = err;
      next(new BadRequest(`Не валидные данные ${message}`));
    } else {
      next(err);
    }
  }
};

// Вход пользователя
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await userSchema.findOne({ email }).select('+password');
    if (!user) {
      next(new AuthError('Такого пользователя нет'));
    } else {
      const matched = await bcrypt.compare(password, user.password);
      if (matched) {
        const jwt = jsonwebtoken.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
        res.status(HTTP_STATUS_OK).send({ user, jwt });
      } else {
        next(new AuthError('Неверая почти или пароль'));
      }
    }
  } catch (err) {
    next(err);
  }
};
