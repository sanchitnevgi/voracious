import dictionary from '../words.json';

const isToughWord = word => !!dictionary[word];

const lookupWord = word => dictionary[word];

const wordsFromPara = paragraph => paragraph.split(' ');

const annotateToughWord = word => {
    if(isToughWord(word)) {
        return `<ruby>${word}<rt>${lookupWord(word)}</rt></ruby>`;
    }
    return word;
}

const isValidTextNode = $node => {
  return $node.nodeType === $node.TEXT_NODE && $node.textContent.trim();
}

const traverse = $node => {

  if(['SCRIPT', 'RUBY'].some(tag => tag === $node.tagName)) return;

  if(isValidTextNode($node)) {
    const words = wordsFromPara($node.textContent.trim());
    const annotatedPara = words.map(annotateToughWord).join(' ');

    const $paragraph = document.createElement('div');
    $paragraph.innerHTML = annotatedPara;

    $node.replaceWith(...$paragraph.childNodes);

    return;
  }

  if($node.hasChildNodes()) {
    $node.childNodes.forEach(traverse);
  }
}

const init = () => {
    traverse(document.body);
}

// Some websites refresh data to add markup (For eg, Medium adds highlights asynchronously)
setTimeout(init, 4000);
