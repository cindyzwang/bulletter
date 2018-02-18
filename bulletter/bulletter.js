let notes = {}, headings;                         // all note objects, all heading elements. persistent
let colorCode = '#FFFF00', colorKey = 'FFFF00';   // current color default yellow
let note;                                         // current note
let button, heading;                              // html elements

class Note {
  constructor(heading) {
    this.heading = heading;
    this.points = [];
  }

  addPoint(point) {
    this.points.push(point);
  }
}

function uniqueColor(newColor, colors) {
  return !colors.includes(newColor);
}

function downloadAndClear(notes) {
  return e => {
    formatAndSave(notes);
    chrome.storage.sync.clear();
  };
}

function formatAndSave(notes) {
  let content = "";
  Object.values(notes).forEach(note => {
    content += `<p>${note.heading}</p>`;
    content += `<ul>`;
    note.points.forEach(point => {
      content += `<li>${point}</li>`;
    });
    content += '</ul>';
  });
  content += '</ul>';

  let htmlDocument = '<html xmlns:office="urn:schemas-microsoft-com:office:office xmlns:word="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">' +
    '<body>' +
      content +
    '</body>' +
  '</html>';

  let dataURI = 'data:text/html,' + encodeURIComponent(htmlDocument);
  let byteNumbers = new Uint8Array(htmlDocument.length);

  for (let i = 0; i < htmlDocument.length; i++) {
    byteNumbers[i] = htmlDocument.charCodeAt(i);
  }

  let blob = new Blob([byteNumbers], {type: 'text/html'});
  // saveAs(blob, 'bulletter.doc');
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = 'bulletter.doc';
  a.click();
  window.URL.revokeObjectURL(url);
}

function listenToColor() {
  const areas = document.getElementsByTagName('area');
  Array.prototype.forEach.call(areas, area => {
    area.addEventListener('click', () => {
      document.getElementById('error').innerHTML = '';
      colorCode = area.alt;
      colorKey = colorCode.slice(1);
      document.getElementById('color-preview').style.backgroundColor = colorCode;
    }, false);
  });
}

function createNote(e) {
  if (e.keyCode === 13 && heading.value !== '') {
    let noteHeading = heading.value;

    if (uniqueColor(colorKey, Object.keys(notes))) {
      let newNote = new Note(noteHeading);
      notes[colorKey] = newNote;

      let oldActiveHeader = document.getElementsByClassName('active')[0];
      if (oldActiveHeader) oldActiveHeader.classList.remove('active');

      let newLi = document.createElement('li');
      newLi.className = colorKey;
      newLi.innerHTML = `<div class='color' id='${colorKey}'></div><div class='heading active'>${noteHeading}</div>`;
      document.getElementById('headings').appendChild(newLi);

      document.getElementById(colorKey).style.backgroundColor = colorCode;
      document.getElementsByClassName(colorKey)[0].addEventListener('click', selectNote);
      document.getElementById('heading-input').value = '';

      selectNote(newNote);
    } else {
      document.getElementById('error').innerHTML = 'Choose a new color';
    }
  }
}

function selectNote(e) {
  if (e.heading) {                     // if a note was just made, make it the current note
    note = e;
    headings = document.getElementById('headings').innerHTML;
    chrome.storage.sync.set({ note, notes, colorKey, headings });
  } else {                             // click handlers
    if (this.lastChild.classList.contains('active')) {  // deselect
      this.lastChild.classList.remove('active');
      note = null;
      colorKey = null;
      headings = document.getElementById('headings').innerHTML;
      chrome.storage.sync.set({ note, notes, colorKey, headings });
    } else {                            // select
      colorKey = this.className;
      note = notes[colorKey];
      let oldActiveHeader = document.getElementsByClassName('active')[0];
      if (oldActiveHeader) oldActiveHeader.classList.remove('active');

      chrome.storage.sync.set({ note, notes, colorKey }, () => {
        this.lastChild.className += ' active';
        headings = document.getElementById('headings').innerHTML;
        chrome.storage.sync.set({ headings })
      });
    }
  }
}

function relist(oldHeadings) {
  document.getElementById('headings').innerHTML += oldHeadings;
  let lis = document.getElementsByTagName('li');
  Array.prototype.forEach.call(lis, li => {
    li.addEventListener('click', selectNote);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.sync.get(['headings', 'notes', 'note'], function(data) {
    listenToColor();
    if (data.headings) {
      headings = data.headings;
      relist(headings);
    }
    if (data.notes) { notes = data.notes; }
    if (data.note) { note = data.note; }

    heading = document.getElementById('heading-input');
    heading.addEventListener('keydown', createNote);
    document.getElementById('color-preview').style.backgroundColor = colorCode;

    button = document.getElementById('download-button');
    button.addEventListener('click', downloadAndClear(notes));
  });
});
