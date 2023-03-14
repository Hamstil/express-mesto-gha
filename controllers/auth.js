const {
  HTTP_STATUS_OK,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_UNAUTHORIZED,
  HTTP_STATUS_CONFLICT,
} = require('http2').constants;
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const { userSchema } = require('../models/user');

// Регистрация пользователя
exports.createUser = async (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await userSchema.create({
      name, about, avatar, email, password: hash,
    });
    res.status(HTTP_STATUS_OK).send(user);
  } catch (err) {
    if (err.code === 11000) {
      res.status(HTTP_STATUS_CONFLICT).send({ message: 'Пользователь с таким email уже есть' });
    } else if (err.name === 'ValidationError') {
      const { message } = err;
      res.status(HTTP_STATUS_BAD_REQUEST).send({ message });
    } else {
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    }
  }
};

// Вход пользователя
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userSchema.findOne({ email }).select('+password');
    if (!user) {
      res.status(HTTP_STATUS_UNAUTHORIZED).send({ message: 'Такого пользователя нет' });
    } else {
      const matched = await bcrypt.compare(password, user.password);
      if (matched) {
        const jwt = jsonwebtoken.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
        res.status(HTTP_STATUS_OK).send({ user, jwt });
      } else {
        res.status(HTTP_STATUS_UNAUTHORIZED).send({ message: 'Неверая почти или пароль' });
      }
    }
  } catch (err) {
    res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
  }
};
