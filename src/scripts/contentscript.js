import dictionary from '../words.json';

// HTML tags that should not traversed
const TAG_BLACKLIST = ['SRCIPT', 'RUBY'];
const DEFINITION_MAX_CHARS = 40;

const displayedDefinitions = {};

const isToughWord = word => !!dictionary[word.toLowerCase()];

const lookupDefinition = word => dictionary[word.toLowerCase()];

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

    const $articles = document.querySelectorAll('article');

    $articles.forEach(traverseAndAnnotate);
}

init();
