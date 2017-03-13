const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

const getDifficulty = word => {

  const url = `http://www.dictionary.com/browse/${word}`;

  return axios.get(url)
    .then(res => res.data)
    .then(html => {
      const $ = cheerio.load(html);
      const difficulty = $('#difficulty-box').attr('data-difficulty');
      return difficulty;
    });

}

const delay = () => new Promise((resolve, reject) => {
  setTimeout(resolve, 500);
})

const readFile = file => new Promise((resolve, reject) => {
  fs.readFile(file, (err ,data) => {
    if(err) reject(err);
    resolve(data);
  })
})

const writeFile = data => new Promise((resolve, reject) => {
  fs.writeFile('dictionary.json', data, (err) => {
    if (err) reject(err);
    resolve('File saved');
  });
})

async function init() {
  const data = await readFile('words.json');

  const dictionary = JSON.parse(data);
  const dictionaryWithDifficulty = {};

  const words = Object.keys(dictionary);

  try {
    for(word of words) {
      const difficulty = await getDifficulty(word);
      console.log({ word, difficulty });
      dictionaryWithDifficulty[word] = { definition: dictionary[word], difficulty }
      await delay();
    }
  }
  catch(err) {
    console.log(err);
  }
  finally {
    console.log('Writing data...');
    await writeFile(JSON.stringify(dictionaryWithDifficulty, null, 2));
  }

}

init();
