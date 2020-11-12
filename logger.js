const colors = require('colors/safe');

module.exports = function logger(data) {
  console.log(`${colors.inverse.bold('[LOG]')} ${data}`);
};