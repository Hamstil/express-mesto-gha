const { cardSchema } = require('../models/card');

const NotFound = 404;
const BadRequest = 400;

// Возвращаем все карточки
exports.getCards = async (req, res) => {
  const cards = await cardSchema.find({}).populate(['owner', 'likes']);
  res.status(200).send(cards);
};

// Создаем каточку
exports.createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;
    const card = await cardSchema.create({ name, link, owner });
    res.status(201).send(card);
  } catch (err) {
    if (err.errors.name || err.errors.link) {
      const { message } = err;
      res.status(BadRequest).send({ message });
    } else {
      res.status(500).send({ message: 'Произошла ошибка' });
    }
  }
};

// Удалем карточку по id
exports.deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await cardSchema.findById(cardId);
    if (!card) {
      res.status(NotFound).send({ message: 'Такой карточки нет' });
      return;
    }
    if (!card.owner.equals(req.user._id)) {
      res.status(BadRequest).send({ message: 'Вы не можете удалить чужую карточку' });
      return;
    }
    card.remove();
    res.status(200).send({ message: 'Карточка успешно удалена' });
  } catch (err) {
    res.status(500).send({ message: 'Произошла ошибка' });
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
      res.status(200).send({ data: card });
    } else {
      res.status(NotFound).send({ message: 'Карточка не найдена' });
    }
  } catch (err) {
    res.status(500).send({ message: 'Произошла ошибка' });
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
      res.status(200).send({ data: card });
    } else {
      res.status(NotFound).send({ message: 'Карточка не найдена' });
    }
  } catch (err) {
    res.status(500).send({ message: 'Произошла ошибка' });
  }
};
