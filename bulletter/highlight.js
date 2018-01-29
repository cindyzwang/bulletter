let colorKey, note, notes;
let element;
const specificNode = document.createElement("span");
specificNode.appendChild(document.createTextNode("TextForBulletterToReplace"));
specificNode.id = "bulletter-replace";
const specificText = '<span id="bulletter-replace">TextForBulletterToReplace</span>';

document.addEventListener('mouseup', (e) => {
  chrome.storage.sync.get(['notes', 'note', 'colorKey'], (data) => {
    notes = data.notes;

    if (data.note && data.colorKey) {
      note = data.note;
      colorKey = data.colorKey;

      element = document.elementFromPoint(e.clientX, e.clientY);
      let range = getSelectionRange();
      let pointText = range.text;
      let pointHTML = range.html;
      if (pointText.length > 0 && (/\S/g).test(pointText)) {
        note.points.push(pointText);

        let oldHTML = element.innerHTML;
        let newPointHTML = makeNewHTML(pointHTML);

        let newHTML = oldHTML.replace(specificText, newPointHTML);

        newHTML.replace(/<span id="bulletter-replace">TextForBulletterToReplace<\/span>/g, '');
        element.innerHTML = newHTML;

        notes[colorKey] = note;
        chrome.storage.sync.set({ note, notes });
      }
    }
  });
}, false);

function getSelectionRange() {
  let range, text = '', html = '';
  if (document.selection && document.selection.createRange) {
    range = document.selection.createRange();
    text = range.text;
    html = range.htmlText;
  } else if (window.getSelection) {
    let selection = window.getSelection();

    if (selection.rangeCount > 0) {
      range = selection.getRangeAt(0);
      text = range.toString();

      let clonedSelection = range.cloneContents();
      let div = document.createElement('div');
      div.appendChild(clonedSelection);
      html = div.innerHTML;

      if (text.length > 0 && (/\S/g).test(text)) {
        range.deleteContents();
        range.insertNode(specificNode);
      }

      if (selection.anchorNode !== selection.focusNode) {
        element = element.parentNode.parentNode;
        html = html.replace(/^<[a-zA-Z]+(>|.*?[^?]>)/, '');        // replace beginning opening tag
        html = html.replace(/< ?\/ ?[a-zA-Z]+(>|.*?[^?]>)$/, '');  // replace ending closing tag
      }
    }
  }
  return { html, text };
}


function makeNewHTML(point) {
  let textColor = parseInt(colorKey, 16) < parseInt('CC0000', 16) ? 'white' : 'black';
  let style = `display: inline !important; background-color: #${colorKey} !important; color: ${textColor}`;
  const openSpan = `<span name='mine' style='${style}'>`;
  const closeSpan = '</span>';
  const openSpanReg = /<span name="mine" style="display: inline !important; background-color: #\w{6} !important; color: (black|white)">/;

  let splitPoint = point.split(/(<\/?\w+(?:(?:\s+\w+(?:\s*=\s*(?:".*?"|'.*?'|[^'">\s]+))?)+\s*|\s*)\/?>)/gim)
                    .filter(el => el !== "" );
  let newPointHTML = "";

  if (splitPoint.length === 1) {
    newPointHTML = `${openSpan}${point}${closeSpan}`;
  } else {
    let openTagReg = /<([a-z]+) *[^\/]*?>/;
    let closeTagReg = /^<\\/;

    splitPoint.forEach( (el, idx) => {
      if (openSpanReg.test(el)) {
        newPointHTML += openSpan;
      } else if (!openTagReg.test(el) && !closeTagReg.test(el) && !openSpanReg.test(splitPoint[idx - 1])) {
        newPointHTML += `${openSpan}${el}${closeSpan}`;
      } else {
        newPointHTML += el;
        if (idx === splitPoint.length - 1 && openSpanReg.test(splitPoint[idx - 1])) {
          newPointHTML += closeSpan;
        }
      }
    });
  }
  return newPointHTML;
}
