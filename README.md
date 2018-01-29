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
* Export the highlighted text as a `.doc` with all highlighted text converted to bullet points

## Structure

![popup]

JavaScript and jQuery are used to build the front end and manipulate the DOM. Chrome Storage saves data which is then accessed through the API. FileSaver.js allows the content to download. Downloading the file clears the extension's data in storage.

## V 0.0.0.2
!!! To Dos !!!
* replace jQuery with JS: jQuery is making this really hefty
* add PDF capabilities: PDF text books are all the rage


[bulletter]: https://chrome.google.com/webstore/detail/bulletter/aofpcjgkejmkjjcklmooaidilaodfjlp
[wiki]: ./docs/wiki.png
[wiki-doc]: ./docs/wiki-doc.png
[popup]: ./docs/popup.png
