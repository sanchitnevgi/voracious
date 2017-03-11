import dictionary from '../words.json';

const isToughWord = word => !!dictionary[word];

const lookupWord = word => dictionary[word];

const wordsFromPara = $paragraph => $paragraph.innerText.split(' ');

const annotateToughWord = word => {
    if(isToughWord(word)) {
        return `<ruby>${word}<rt>${lookupWord(word)}</rt></ruby>`;
    }
    return word;
}

const init = () => {
    const $paragraphs = document.querySelectorAll('p, li');

    Array.from($paragraphs).forEach($paragraph => {
        const words = wordsFromPara($paragraph);
        const annotatePara = words.map(annotateToughWord).join(' ');
        $paragraph.innerHTML = annotatePara;
    });
}

// Some websites refresh data to add markup (For eg, Medium adds highlights asynchronously)
setTimeout(init, 4000);
