const router = require('express').Router();
const ejs    = require('ejs');
const fs     = require('fs');

const template = fs.readFileSync('template.ejs').toString();

// TODO: Implement implicit index

router.use((req, res, next) => {
  if (/\.template\.html$/.test(req.url)) { res.status(404).end(); }
  next();
});

router.use((req, res, next) => {
  let _, name, extension;
  try {
    ([_, name, extension] = req.url.match(/(.*)\.(.*)$/));
  } catch (e) {
    return res.status(404), next();
  }
  
  if (extension !== 'html') { return next(); }
  
  const filename = `${__dirname}/public/${name}.template.html`;
  
  if (!fs.existsSync(filename)) { return res.status(404), next(); }

  const file = fs.readFileSync(filename).toString();
  const [__, head, body] = file.match(/(?:<head>([\s\S]*)<\/head>[\s\S]*)?<body>([\s\S]*)<\/body>/);
  
  return res.send(ejs.render(template, { head, body }));
});

module.exports = router;