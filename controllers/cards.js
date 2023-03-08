const {
  HTTP_STATUS_OK,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = require('http2').constants;
const { cardSchema } = require('../models/card');

// Возвращаем все карточки
exports.getCards = async (req, res) => {
  try {
    const cards = await cardSchema.find({}).populate(['owner', 'likes']);
    if (cards) {
      res.status(HTTP_STATUS_OK).send(cards);
    }
  } catch (err) {
    res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
  }
};

// Создаем каточку
exports.createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;
    const card = await cardSchema.create({ name, link, owner });
    res.status(HTTP_STATUS_OK).send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const { message } = err;
      res.status(HTTP_STATUS_BAD_REQUEST).send({ message });
    } else {
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    }
  }
};

// Удалем карточку по id
exports.deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await cardSchema.findById(cardId);
    if (!card) {
      res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Такой карточки нет' });
      return;
    }
    if (!card.owner.equals(req.user._id)) {
      res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Вы не можете удалить чужую карточку' });
      return;
    }
    await card.remove();
    res.status(HTTP_STATUS_OK).send({ message: 'Карточка успешно удалена' });
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданны некорректные данные' });
    } else {
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    }
  }
};

// Поставить лайк
exports.getLike = async (req, res) => {
  try {
    const card = await cardSchema.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (card) {
      res.status(HTTP_STATUS_OK).send({ data: card });
    } else {
      res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка не найдена' });
    }
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданны некорректные данные' });
    } else {
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    }
  }
};

// Удалить лайк
exports.deleteLike = async (req, res) => {
  try {
    const card = await cardSchema.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (card) {
      res.status(HTTP_STATUS_OK).send({ data: card });
    } else {
      res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка не найдена' });
    }
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданны некорректные данные' });
    } else {
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    }
  }
};
