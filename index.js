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

// I'll put this in another file later
const { readDatabase, writeDatabase, writeDatabaseRaw } = require('./db-funcs');
const logger = require('./logger');
process.stdin.on('data', async (chunk) => {
  const command = chunk.toString('utf-8').replace(/\r\n/g, '').split(' ');

  const database = await readDatabase();
  
  if (command.join(' ').startsWith('delete user')) {
    const userIndex = database.findIndex(({ username }) => username === command.slice(2).join(' '));
    database.splice(userIndex, 1);
    await writeDatabaseRaw(database);

    logger(`Deleted user '${command.slice(2).join(' ')}'`);
    return;
  } else if (command[0] === 'readdb') {
    logger(`Entire database contents:\n${JSON.stringify(database, null, '  ')}`);
  }
});