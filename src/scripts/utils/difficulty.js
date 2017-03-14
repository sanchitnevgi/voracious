/*
 * Helper script to get difficulties of words by scraping dictionary.com
 * Requries Node v7 with the --harmony-async-await flag.
 * The script consumes words.json and produces dictionary.json and notFound.txt
 */

const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

const notFound = {};

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

const writeFile = (file, data) => new Promise((resolve, reject) => {
  fs.writeFile(file, data, (err) => {
    if (err) reject(err);
    resolve('File saved');
  });
})

async function init() {
  const data = await readFile('words.json');

  const dictionary = JSON.parse(data);
  const dictionaryWithDifficulty = {};

  const words = Object.keys(dictionary);

  for(word of words) {
    try {
      const difficulty = await getDifficulty(word);
      console.log({ word, difficulty });
      dictionaryWithDifficulty[word] = { definition: dictionary[word], difficulty: parseInt(difficulty) }
      await delay();
    }
    catch(err) {
      console.log(`Could not find word ${word}`);
      notFound[word] = true;

      // Add default difficulty
      dictionaryWithDifficulty[word] = { definition: dictionary[word], difficulty: 50 }
    }
  }

  console.log('Writing data...');
  await writeFile('dictionary.json', JSON.stringify(dictionaryWithDifficulty, null, 2));
  await writeFile('notFound.txt', Object.keys(notFound));
}

init();
