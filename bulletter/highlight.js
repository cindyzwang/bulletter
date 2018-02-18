let colorKey, note, notes;

const OPEN_TAG_REG = /^<([a-z]+) *[^\/]*?>$/;
const CLOSE_TAG_REG = /^<\/[a-z]+ ?>$/;

document.addEventListener('mouseup', (e) => {
  chrome.storage.sync.get(['notes', 'note', 'colorKey'], data => {
    notes = data.notes;

    if (data.note && data.colorKey) {
      note = data.note;
      colorKey = data.colorKey;

      const range = getSelectionRange();
      const { pointText, container } = range;
      debugger
      const oldPointHTML = splitByHTMLTags(range.html).join('');

      // if something has been highlighted...
      if (pointText.length > 0 && (/\S/g).test(pointText)) {
        note.points.push(pointText);

        const oldContainerHTML = container.innerHTML;
        const newPointHTML = makeNewHTML(oldPointHTML);

        const newHTML = oldContainerHTML.replace(oldPointHTML, newPointHTML);

        container.innerHTML = newHTML;

        notes[colorKey] = note;
        chrome.storage.sync.set({ note, notes });
      }
    }
  });
}, false);

function getSelectionRange() {
  // returns the html as a string, the text highlighted, 
  // and the lowest element on the dom tree that contains everything highlighted
  let range, pointText = '', html = '';
  let container;
  const selection = window.getSelection();

  // make sure that something was actually highlighted
  if (selection.rangeCount > 0) {
    range = selection.getRangeAt(0);
    pointText = range.toString();

    if (selection.anchorNode !== selection.focusNode) {
      container = range.commonAncestorContainer;
    } else {
      container = range.commonAncestorContainer.parentElement;
    }
    
    // turn the highlighted HTML into a string
    // NOTE: range.cloneContents will include opening/closing tags
    // so if you start/stop in the middle of an element, it will include
    // the opening/closing tag at the start/end
    const clonedSelection = range.cloneContents();
    const div = document.createElement('div');
    div.append(clonedSelection);
    html = div.innerHTML;
  }

  // return the html as a string, and the text w/o the html tags
  return { html, pointText, container };
}

function splitByHTMLTags(htmlString) {
  const splitHTMLString = htmlString.split(/(<\/?\w+(?:(?:\s+\w+(?:\s*=\s*(?:".*?"|'.*?'|[^'">\s]+))?)+\s*|\s*)\/?>)/gim)
    .filter(el => el !== "");
  
  // if the first element is an opening tag or if the last element is a closing tag, strip it out
  // bc range.cloneContents adds those opening/closing tags if you highlight partial html elements
  let startIndex = 0;
  let endIndex = splitHTMLString.length;
  
  for (const substr of splitHTMLString) {
    if (OPEN_TAG_REG.test(substr)) {
      startIndex++;
    } else {
      break;
    }
  }

  for (let i = endIndex - 1; i > startIndex; i--) {
    if (CLOSE_TAG_REG.test(splitHTMLString[i])) {
      endIndex--;
    } else {
      break;
    }
  }

  return splitHTMLString.slice(startIndex, endIndex)
}


function makeNewHTML(htmlString) {
  // adds my highlighting spans inside of html tags from the page
  let textColor = parseInt(colorKey, 16) < parseInt('CC0000', 16) ? 'white' : 'black';
  let style = `display: inline !important; background-color: #${colorKey} !important; color: ${textColor}`;
  const openSpan = `<span name='mine' style='${style}'>`;
  const closeSpan = '</span>';
  const openSpanReg = /<span name="mine" style="display: inline !important; background-color: #\w{6} !important; color: (black|white)">/;

  let splitPoint = splitByHTMLTags(htmlString)
  let newPointHTML = "";

  if (splitPoint.length === 1) {
    newPointHTML = `${openSpan}${htmlString}${closeSpan}`;
  } else {
    splitPoint.forEach((el, idx) => {
      if (!OPEN_TAG_REG.test(el) && !CLOSE_TAG_REG.test(el)) {
        newPointHTML += `${openSpan}${el}${closeSpan}`
      } else {
        newPointHTML += el;
      }
    });
  }
  return newPointHTML;
}
