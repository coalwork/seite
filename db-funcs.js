const fs = require('fs');
const fsp = require('fs').promises;

function readDatabase() {
  return new Promise((resolve) => {
    let data = '';
    fs.createReadStream(process.env.DATABASE, 'utf-8')
    .on('data', (chunk) => {
      data += chunk;
    })
    .on('end', () => resolve(JSON.parse(data)));
  });
}

function writeDatabaseRaw(obj) {
  return fsp.writeFile(process.env.DATABASE, JSON.stringify(obj), 'utf-8');
}

async function writeDatabase(obj) {
  let userData = [];

  try {
    userData = await readDatabase();
  } catch(err) {
    throw Error('Failed to read database');
  }

  userData.push(obj);

  const json = JSON.stringify(userData);
  await fsp.writeFile(process.env.DATABASE, json, 'utf-8');
}

module.exports = { readDatabase, writeDatabase, writeDatabaseRaw };