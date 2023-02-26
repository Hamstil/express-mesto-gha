const { userSchema } = require('../models/user');

exports.getUsers = async (req, res) => {
  const users = await userSchema.find({});
  res.status(200).send(users);
};

exports.getUsersById = async (req, res) => {
  try {
    const user = await userSchema.findById(req.params.id);
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(404).send({ message: 'Нет пользователя' });
    }
  } catch (err) {
    res.status(500).send({ message: 'Произошла ошибка' });
  }
};

exports.createUser = (req, res) => {
  userSchema.create(req.body).then((user) => {
    res.status(201).send(user);
  }).catch((err) => {
    if (err.errors.name.name === 'ValidatorError') {
      const { message } = err;
      res.status(400).send({ message });
    } else {
      res.status(500).send({ ...err, message: 'Произошла ошибка' });
    }
  });
};
