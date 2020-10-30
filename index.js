const express = require('express');

const PORT = process.env.PORT || 2540;
const app = express();

const templateMiddleware = require('./template-middleware');

app.use(templateMiddleware);

app.use(express.static('public'));

app.listen(PORT, (err) => {
  if (err) { throw err; }
  console.log(`App is listening on port ${PORT}`);
});