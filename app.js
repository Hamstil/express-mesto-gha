const mongoose = require('mongoose');
const express = require('express');

const { routes } = require('./routes');

const app = express();

const { PORT = 3000 } = process.env;

app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

app.use(routes);

async function main() {
  await mongoose.connect('mongodb://localhost:27017/mydb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Connect to db');
  await app.listen(PORT);
  console.log(`Server listen port ${PORT}`);
}

main();
