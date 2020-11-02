const express = require('express')
const router  = express.Router();
const path    = require('path');
const ejs     = require('ejs');
const fs      = require('fs');
const { pathToFileURL } = require('url');

const template = fs.readFileSync('template.ejs').toString();

const staticServer = express.static('public');

router.use((req, res, next) => {
  const filename = path.join(__dirname, 'public', req.path, 'index.template.html');
  
  if (!fs.existsSync(filename)) {
    return next();
  }
  
  const file = fs.readFileSync(filename, 'utf-8');
  
  res.send(renderTemplate(template, file, req.path));
});

// Don't serve any *.template.html files
router.use((req, res, next) => {
  if (/\.template\.html$/.test(req.url)) { return next(); }
  staticServer(req, res, next);
});

module.exports = router;

function renderTemplate(template, file, reqPath) {
  const [, head, body] = file.match(/(?:<head>([\s\S]*)<\/head>[\s\S]*)?<body>([\s\S]*)<\/body>/);

  return ejs.render(template, { head, body, path: reqPath });
}