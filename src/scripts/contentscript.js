import dictionary from '../dictionary.json';

// HTML tags that should not traversed
const TAG_BLACKLIST = ['SCRIPT', 'RUBY', 'BUTTON', 'CANVAS', 'INPUT', 'TABLE'];
const DEFINITION_MAX_CHARS = 60;
const DIFFICULTY_THRESHOLD = 30;
const ARTICLE_SELECTOR = ['article', '.article', 'section', '.articles', '.article-text', '.story-content'].join(', ');

const displayedDefinitions = {};

const isToughWord = word => dictionary[word.toLowerCase()] && getWordDifficulty(word) >= DIFFICULTY_THRESHOLD;

const lookupDefinition = word => dictionary[word.toLowerCase()].definition;

const getWordDifficulty = word => dictionary[word.toLowerCase()].difficulty;

const wordsFromPara = paragraph => paragraph.split(' ');

const overflowText = text => {
  if(text.length > DEFINITION_MAX_CHARS)
    return text.slice(0, DEFINITION_MAX_CHARS-2).concat('...');
  return text;
}

const compose = f => g => x => f(g(x))

const getDefinition = compose(overflowText)(lookupDefinition);

const annotateToughWord = word => {
    if(isToughWord(word) && !displayedDefinitions[word]) {
      displayedDefinitions[word] = true;
      return `<ruby class="annotation">${word}<rt>${getDefinition(word)}</rt></ruby>`;
    }
    return word;
}

const isValidTextNode = $node => {
  return $node.nodeType === $node.TEXT_NODE && $node.textContent.trim();
}

const traverseAndAnnotate = $node => {

  if(TAG_BLACKLIST.some(tag => tag === $node.tagName)) return;

  if(isValidTextNode($node)) {
    const words = wordsFromPara($node.textContent);
    const annotatedPara = words.map(annotateToughWord).join(' ');

    const $paragraph = document.createElement('div');
    $paragraph.innerHTML = annotatedPara;

    $node.replaceWith(...$paragraph.childNodes);

    return;
  }

  if($node.hasChildNodes()) {
    $node.childNodes.forEach(traverseAndAnnotate);
  }
}

const init = () => {
    const $content = document.querySelectorAll(ARTICLE_SELECTOR);
    $content.forEach(traverseAndAnnotate);
}

init();
