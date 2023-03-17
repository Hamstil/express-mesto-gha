const { HTTP_STATUS_OK } = require('http2').constants;
const { userSchema } = require('../models/user');
const BadRequest = require('../errors/BadRequest'); // 400
const NotFound = require('../errors/NotFound'); // 404

// Получить всех пользователей
exports.getUsers = async (req, res, next) => {
  try {
    const users = await userSchema.find({});
    res.status(HTTP_STATUS_OK).send(users);
  } catch (err) {
    next(err);
  }
};

// Получить пользователя по id
exports.getUsersById = async (req, res, next) => {
  try {
    const user = await userSchema.findById(req.params.userId);
    if (user) {
      res.status(HTTP_STATUS_OK).send(user);
    } else {
      next(new NotFound('Такого пользователя нет'));
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequest('Переданны некорректные данные'));
    } else {
      next(err);
    }
  }
};

// Получить текущего пользователя
exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await userSchema.findById(req.user._id);
    if (user) {
      res.status(HTTP_STATUS_OK).send(user);
    } else {
      next(new NotFound('Нет пользователя'));
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequest('Переданы некорректные данные'));
    } else next(err);
  }
};

// Обновление юзера (имя, описание)
exports.updateUser = async (req, res, next) => {
  const { name, about } = req.body;
  try {
    const user = await userSchema.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      next(new NotFound('Пользователь не найден'));
    }
    res.status(HTTP_STATUS_OK).send(user);
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      const { message } = err;
      next(new BadRequest(`Не валидные данные ${message}`));
    } else {
      next(err);
    }
  }
};

// Обновление юзера (аватар)
exports.updateAvatar = async (req, res, next) => {
  const { avatar } = req.body;
  try {
    const user = await userSchema.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      next(new NotFound('Пользователь не найден'));
    }
    res.status(HTTP_STATUS_OK).send(user);
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      const { message } = err;
      next(new BadRequest(`Не валидные данные ${message}`));
    } else {
      next(err);
    }
  }
};
