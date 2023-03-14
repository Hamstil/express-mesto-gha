const express = require('express');

const cardRoutes = express.Router();
const {
  getCards,
  createCard,
  deleteCard,
  getLike,
  deleteLike,
} = require('../controllers/cards');

cardRoutes.get('/', getCards);
cardRoutes.post('/', createCard);
cardRoutes.delete('/:cardId', deleteCard);
cardRoutes.put('/:cardId/likes', getLike);
cardRoutes.delete('/:cardId/likes', deleteLike);

exports.cardRoutes = cardRoutes;
