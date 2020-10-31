const router = require('express').Router();
const path   = require('path');
const ejs    = require('ejs');
const fs     = require('fs');
const { pathToFileURL } = require('url');

const template = fs.readFileSync('template.ejs').toString();

router.use((req, res, next) => {
  if (/\.template\.html$/.test(req.url)) { res.status(404).end(); }
  next();
});

router.use((req, res, next) => {
  const filename = path.join(__dirname, 'public', req.path, 'index.template.html');
  console.log(filename);

  if (!fs.existsSync(filename)) {
    return next();
  }

  const file = fs.readFileSync(filename, 'utf-8');

  res.send(renderTemplate(template, file));
});

module.exports = router;

function renderTemplate(template, file) {
  const [, head, body] = file.match(/(?:<head>([\s\S]*)<\/head>[\s\S]*)?<body>([\s\S]*)<\/body>/);

  return ejs.render(template, { head, body });
}