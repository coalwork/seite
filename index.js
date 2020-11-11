const express = require('express');
const path    = require('path');

require('dotenv').config();

const PORT = process.env.PORT || 2540;
const app = express();

const templateMiddleware = require('./template-middleware');
const endpoints = require('./api-endpoints');

app.get('/favicon.ico', (_, res) => res.redirect('/assets/favicon.png'));

app.use('/api', endpoints);

// Please keep at end - files are statically served at the end of this middleware
app.use(templateMiddleware);

app.listen(PORT, (err) => {
  if (err) { throw err; }
  console.log(`App is listening on port ${PORT}`);
});