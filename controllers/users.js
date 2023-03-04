const { userSchema } = require('../models/user');

const NotFound = 404;
const BadRequest = 400;

// Получить всех пользователей
exports.getUsers = async (req, res) => {
  const users = await userSchema.find({});
  res.status(200).send(users);
};

// Получить пользователя по id
exports.getUsersById = async (req, res) => {
  try {
    const user = await userSchema.findById(req.params.userId);
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(NotFound).send({ message: 'Такого пользователя нет' });
    }
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(BadRequest).send({ message: 'Переданны некорректные данные' });
    } else {
      res.status(500).send({ message: 'Произошла ошибка' });
    }
  }
};

// Получить текущего пользователя
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await userSchema.findById(req.user._id);
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(NotFound).send({ message: 'Нет пользователя' });
    }
  } catch (err) {
    res.status(500).send({ message: 'Произошла ошибка' });
  }
};

// Создание пользователя
exports.createUser = async (req, res) => {
  try {
    const user = await userSchema.create(req.body);
    res.status(201).send(user);
  } catch (err) {
    if (err.errors.name || err.errors.about || err.errors.avatar) {
      const { message } = err;
      res.status(BadRequest).send({ message });
    } else {
      res.status(500).send({ message: 'Произошла ошибка' });
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
      res.status(NotFound).send({ message: 'Пользователь не найден' });
    }
    res.status(200).send(user);
  } catch (err) {
    if (err.errors.name || err.errors.about) {
      const { message } = err;
      res.status(BadRequest).send({ message });
    } else {
      res.status(500).send({ message: 'Произошла ошибка' });
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
      res.status(NotFound).send({ message: 'Пользователь не найден' });
    }
    res.status(200).send(user);
  } catch (err) {
    if (err.errors.avatar) {
      const { message } = err;
      res.status(BadRequest).send({ message });
    } else {
      res.status(500).send({ message: 'Произошла ошибка' });
    }
  }
};
