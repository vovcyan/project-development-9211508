const express = require('express');
const logger = require('morgan');
const path = require('path');

const apiRouter = require('./router');

// Definition of express app
const app = express();
const port = 8080;

// Use morgan logger as middleware
app.use(logger());

// Use internal API handler
app.use(apiRouter);

// Use handler for static files which returns files of application bundle
app.use(express.static(path.resolve(__dirname, '../dist')));

// Returns index.html file content for each non-API request
app.get('*', (_, res) => {
  res.sendFile(path.resolve(__dirname, '../dist/index.html'));
});

// Start application of port 8080
app.listen(port, () => {
  console.log(`Application listening on port ${port}`);
});