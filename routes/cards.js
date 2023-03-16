const express = require('express');

const cardRoutes = express.Router();
const {
  getCards,
  createCard,
  deleteCard,
  getLike,
  deleteLike,
} = require('../controllers/cards');
const { validationCreatCard, validationCardById } = require('../middlewares/validation');

cardRoutes.get('/', getCards);
cardRoutes.post('/', validationCreatCard, createCard);
cardRoutes.delete('/:cardId', validationCardById, deleteCard);
cardRoutes.put('/:cardId/likes', validationCardById, getLike);
cardRoutes.delete('/:cardId/likes', validationCardById, deleteLike);

exports.cardRoutes = cardRoutes;
