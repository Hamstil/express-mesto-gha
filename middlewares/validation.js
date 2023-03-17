const { celebrate, Joi } = require('celebrate');

const { regexUrl } = require('../utils/constants');
const BadRequest = require('../errors/BadRequest');

// Метод валидации url
const validationUrl = (url) => {
  if (regexUrl.test(url)) {
    return url;
  } throw new BadRequest('Не корректный Url');
};

//  Регистрация
module.exports.validationCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validationUrl),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8).message('Пароль должен быть минимим 8 символов'),
  }),
});

// Логин
module.exports.validationLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

// Обновление данных юзера
module.exports.validationUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

// Обновление аватара
module.exports.validationUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(validationUrl),
  }),
});

// Поиск юзера по id
module.exports.validationUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }),
});

// Создание карточки
module.exports.validationCreatCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(validationUrl),
  }),
});

// Поиск карточки по id
module.exports.validationCardById = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
});
