const { HTTP_STATUS_OK } = require('http2').constants;
const { cardSchema } = require('../models/card');
const BadRequest = require('../errors/BadRequest'); // 400
const NotFound = require('../errors/NotFound'); // 404
const CurrentError = require('../errors/CurrentError');

// Возвращаем все карточки
exports.getCards = async (req, res, next) => {
  try {
    const cards = await cardSchema.find({}).populate(['owner', 'likes']);
    if (cards) {
      res.status(HTTP_STATUS_OK).send(cards);
    }
  } catch (err) {
    next(err);
  }
};

// Создаем каточку
exports.createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;
    const card = await cardSchema.create({ name, link, owner });
    res.status(HTTP_STATUS_OK).send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const { message } = err;
      next(new BadRequest(`На валидные данные ${message}`));
    } else {
      next(err);
    }
  }
};

// Удалем карточку по id
exports.deleteCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = await cardSchema.findById(cardId);
    if (!card) {
      throw new NotFound('Такой катрочки нет');
    }
    if (!card.owner.equals(req.user._id)) {
      throw new CurrentError('Вы не можете удалить чужую карточку');
    }
    await card.remove();
    res.status(HTTP_STATUS_OK).send({ message: 'Карточка успешно удалена' });
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequest('Переданны некорректные данные'));
    } else {
      next(err);
    }
  }
};

// Поставить лайк
exports.getLike = async (req, res, next) => {
  try {
    const card = await cardSchema.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (card) {
      res.status(HTTP_STATUS_OK).send({ data: card });
    } else {
      next(new NotFound('Карточка не найдена'));
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequest('Переданны некорректные данные'));
    } else {
      next(err);
    }
  }
};

// Удалить лайк
exports.deleteLike = async (req, res, next) => {
  try {
    const card = await cardSchema.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (card) {
      res.status(HTTP_STATUS_OK).send({ data: card });
    } else {
      next(new NotFound('Карточка не найдена'));
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequest('Переданны некорректные данные'));
    } else {
      next(err);
    }
  }
};
