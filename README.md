# Bulletter

![wiki]


![wiki-doc]

Having to stop reading to take notes makes homework take much longer than it needs to. [Bulletter][bulletter] allows users to highlight their text to create color-coded notes. These notes can then be exported as a `.doc` file.

## Summary
Users can:
* Highlight webpage text
* Choose between different colored highlighters
* Text that is hightlighted the same color will be grouped together under the same heading
* The user can add more colors
* Export the highlighted text as a `.doc` with all highlighted text converted to bullet points and headings

## Structure

![popup]

JavaScript is used to build the front end and manipulate the DOM. Chrome Storage saves data which is then accessed through the API. Downloading the file clears the extension's data in storage.

This extension is implemented using the standard Chrome extension technology: Javascript, HTML, and CSS.  In addition to the `manifest.json` and `package.json` files, there are two scripts:

- `highlight.js`: will contain the logic for adding colors and headings. This is the content script that interacts with the current webpage
- `bulletter.js`: will contain the logic for extracting the highlighted text and grouping it into the correct heading

Two HTML files:
- `style.css`: the file containing the styling rules for recoloring
- `options.html`: the file that renders the Colors menu for the user


## V 0.0.0.2
!!! To Dos !!!
* [x] replace jQuery with JS
* [ ] add PDF capabilities: PDF text books are all the rage


[bulletter]: https://chrome.google.com/webstore/detail/bulletter/aofpcjgkejmkjjcklmooaidilaodfjlp
[wiki]: ./store-images/wiki.png
[wiki-doc]: ./store-images/wiki-doc.png
[popup]: ./store-images/popup2.png
