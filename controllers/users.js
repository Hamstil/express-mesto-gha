const {
  HTTP_STATUS_OK,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = require('http2').constants;
const { userSchema } = require('../models/user');

// Получить всех пользователей
exports.getUsers = async (req, res) => {
  try {
    const users = await userSchema.find({});
    if (users) {
      res.status(HTTP_STATUS_OK).send(users);
    }
  } catch (err) {
    res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
  }
};

// Получить пользователя по id
exports.getUsersById = async (req, res) => {
  try {
    const user = await userSchema.findById(req.params.userId);
    if (user) {
      res.status(HTTP_STATUS_OK).send(user);
    } else {
      res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Такого пользователя нет' });
    }
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданны некорректные данные' });
    } else {
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    }
  }
};

// Получить текущего пользователя
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await userSchema.findById(req.user._id);
    if (user) {
      res.status(HTTP_STATUS_OK).send(user);
    } else {
      res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Нет пользователя' });
    }
  } catch (err) {
    res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
  }
};

// Создание пользователя
exports.createUser = async (req, res) => {
  try {
    const user = await userSchema.create(req.body);
    res.status(HTTP_STATUS_OK).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const { message } = err;
      res.status(HTTP_STATUS_BAD_REQUEST).send({ message });
    } else {
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    }
  }
};

// Обновление юзера (имя, описание)
exports.updateUser = async (req, res) => {
  const { name, about } = req.body;
  try {
    const user = await userSchema.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь не найден' });
    }
    res.status(HTTP_STATUS_OK).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const { message } = err;
      res.status(HTTP_STATUS_BAD_REQUEST).send({ message });
    } else {
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    }
  }
};

// Обновление юзера (аватар)
exports.updateAvatar = async (req, res) => {
  const { avatar } = req.body;
  try {
    const user = await userSchema.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь не найден' });
    }
    res.status(HTTP_STATUS_OK).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const { message } = err;
      res.status(HTTP_STATUS_BAD_REQUEST).send({ message });
    } else {
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    }
  }
};
