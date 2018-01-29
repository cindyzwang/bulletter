## Bulletter

### Background

Having to stop reading to take notes makes homework take much longer than it needs to. This Chrome extension will allow students to highlight their text to create color-coded notes. These notes can then be exported as a `.doc` file.

### Functionality & MVP

With this extension, users will be able to:

- [ ] Highlight webpage text
- [ ] Choose between different colored highlighters
- [ ] Text that is hightlighted the same color will be grouped together under the same heading
- [ ] The user can add more colors
- [ ] Export the highlighted text as a `.doc` with all highlighted text converted to bullet points

### Wireframes

![wireframes](/docs/bulletter.png)

### Technologies & Technical Challenges

This extension will be implemented using the standard Chrome extension technology: Javascript, HTML, and CSS.  In addition to the `manifest.json` and `package.json` files, there will be two scripts:

- `notes.js`: will contain the logic for adding colors and headings
- `bulletter.js`: will contain the logic for extracting the highlighted text and grouping it into the correct heading

In addition, there will be two HTML files:
- `style.css`: the file containing the styling rules for recoloring
- `options.html`: the file that renders the Colors menu for the user

The primary technical challenges will be:

- Getting the text to highlight on the page
- Creating the correct HTML string from the highlighted text
- Styling the output correctly

Bonus Features:
- Highlighting and exporting from PDF files


### Implementation Timeline

**Day 1**: Get started on the infrastructure of the extension, following <a href="https://developer.chrome.com/extensions/getstarted">this guide</a> from Chrome.  By the end of the day, I will have:

- A completed `package.json`
- A completed `manifest.json`
- The ability to locate and alter a DOM element

**Day 2**: Create the options page and connect the options to the notes logic. By the end of the day, I will have:

- The ability to choose colors
- The ability to create headings

**Days 3**: Work on adding colors to the DOM by class and other attributes.  By the end of the day, I will have:

- The ability to highlight text
- The ability to extract the highlighted text
- HTML styling on the extracted text to prepare for downloading

**Day 4**: Download the extracted text into a `.docx` file. By the end of the day, I will have:

- The ability to create a `.docx` file with the correct notes
