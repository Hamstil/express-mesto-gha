const jsonwebtoken = require('jsonwebtoken');

exports.auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(401).send({ message: 'Необходима авторизация' });
  } else {
    const token = authorization.replace('Bearer ', '');
    let payload;
    try {
      payload = jsonwebtoken.verify(token, 'some-secret-key');
    } catch (err) {
      res.status(401).send({ message: 'Необходима авторизация' });
    }
    req.user = payload;
    next();
  }
};
