const express = require('express');
const { writeDatabase, readDatabase } = require('./db-funcs');
const logger = require('./logger');
const router = express.Router();

router.post('/register', express.urlencoded({ extended: false }), async (req, res) => {
  const { username, password } = req.body;

  // Validate user
  try {
    await validateUsername(username);
    validatePassword(password);
  } catch (error) {
    // Using fragment to be able to hide message
    return res.redirect(`/login#${encodeURIComponent(error.message)}`);
  }

  // Otherwise, save user to database
  try {
    await writeDatabase({ username, password });
    logger(`User '${username}' has successfully registered`);
  } catch(error) {
    return res.redirect(`/login#${encodeURIComponent('Failed to write to database')}`);
  }

  res.redirect('/');
});

async function validateUsername(username) {
  let err = Error();
  err.message = null;

  // Conditions
  username.length                    || (err.message = 'Username must be present');
  username.length >= 3               || (err.message = 'Username must be at least three characters long');
  username.length <= 16              || (err.message = 'Username may not be longer than 16 characters');
  username.replace(/\s/g, '').length || (err.message = 'Username may not only contain whitespace');
  username.trim() === username       || (err.message = 'Username may not have whitespace before or after it');

  const data = await readDatabase();
  
  data
    .map(({ username: dbUsername }) => dbUsername)
    .includes(username) 
  && (err.message = 'Username is already taken');

  if (err.message !== null) { throw err; }
}

function validatePassword(password) {
  let err = Error();
  err.message = null;

  // Conditions
  password.length        || (err.message = 'Password must be present');
  password.length <= 128 || (err.message = 'Password may not be longer than 128 characters');

  if (err.message !== null) { throw err; }
}

module.exports = router;