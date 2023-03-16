const mongoose = require('mongoose');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');

const { routes } = require('./routes');
const setErrors = require('./middlewares/setErrors');

const app = express();

const { PORT = 3000 } = process.env;

app.use(express.json());
app.use(helmet());
app.use(cors());

// Кастомный мидлвер - выводит в консоль метод и путь
app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

app.use(routes);
app.use(errors());
app.use(setErrors);

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
