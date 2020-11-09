const fs  = require('fs');
const ejs = require('ejs');

const template = fs.readFileSync('template.ejs', 'utf-8');

module.exports = function renderTemplate(file, reqPath) {
  const [, head, body] = file.match(/(?:<head>([\s\S]*)<\/head>[\s\S]*)?<body>([\s\S]*)<\/body>/);

  return ejs.render(template, { head, body, path: reqPath });
};