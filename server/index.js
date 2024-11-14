const express = require('express');
const logger = require('morgan');
const path = require('path');

const apiRouter = require('./router');

const app = express();
const port = 8080;

app.use(logger());
app.use(apiRouter);

app.use(express.static(path.resolve(__dirname, '..', 'dist')));

app.listen(port, () => {
  console.log(`Application listening on port ${port}`);
});