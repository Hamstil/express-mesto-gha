const mongoose = require('mongoose');
const express = require('express');

const { routes } = require('./routes');

const app = express();

const { PORT = 3000 } = process.env;

// Кастомный мидлвер - выводит в консоль метод и путь
app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

// Обогащает запросы объектом user
app.use((req, res, next) => {
  req.user = {
    _id: '63fc908143b30f8180743a21',
  };

  next();
});

app.use(routes);

async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Connect to db');
  await app.listen(PORT);
  console.log(`Server listen port ${PORT}`);
}

main();
