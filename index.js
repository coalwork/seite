const express = require('express');
const path    = require('path');

const PORT = process.env.PORT || 2540;
const app = express();

const templateMiddleware = require('./template-middleware');

app.get('/favicon.ico', (_, res) => res.redirect('/assets/favicon.png'));

app.use(templateMiddleware);

app.listen(PORT, (err) => {
  if (err) { throw err; }
  console.log(`App is listening on port ${PORT}`);
});