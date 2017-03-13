import dictionary from '../words.json';

// HTML tags that should not traversed
const TAG_BLACKLIST = ['SRCIPT', 'RUBY'];

const isToughWord = word => !!dictionary[word.toLowerCase()];

const lookupDefinition = word => dictionary[word];

const wordsFromPara = paragraph => paragraph.trim().split(' ');

const annotateToughWord = word => {
    if(isToughWord(word)) {
        return `<ruby>${word}<rt>${lookupDefinition(word)}</rt></ruby>`;
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

    $articles.forEach(traverseAndAnnotate)
}

// Some websites refresh data to add markup (For eg, Medium adds highlights asynchronously)
setTimeout(init, 4000);
