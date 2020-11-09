const express = require('express')
const router  = express.Router();
const path    = require('path');
const ejs     = require('ejs');
const fs      = require('fs');
const { pathToFileURL } = require('url');

const renderTemplate = require('./render-template');
const template = fs.readFileSync('template.ejs').toString();

const staticServer = express.static('public');

router.use((req, res, next) => {
  const filename = path.join(__dirname, 'public', req.path, 'index.template.html');
  
  if (!fs.existsSync(filename)) {
    return next();
  }
  
  const file = fs.readFileSync(filename, 'utf-8');
  
  res.send(renderTemplate(file, req.path));
});

// Gets html template:
// /error.html => /error.template.html
router.use((req, res, next) => {
  const pathToFile = path.join(__dirname, 'public', req.path.replace(/\.html$/, '\.template.html'));

  if (!fs.existsSync(pathToFile) || !/\.html$/.test(req.path)) { return next(); }

  const file = fs.readFileSync(pathToFile, 'utf-8');

  res.send(renderTemplate(file, req.path));
});

// Don't serve any *.template.html files
router.use((req, res, next) => {
  if (/\.template\.html$/.test(req.url)) { return next(); }
  staticServer(req, res, next);
});

router.use((req, res) => {
  const file = fs.readFileSync(path.join(__dirname, 'public', 'error.template.html'), 'utf-8');
  res.send(renderTemplate(file, req.path));
});

module.exports = router;