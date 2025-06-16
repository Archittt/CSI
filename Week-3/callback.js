const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'example.txt');

fs.access(filePath, fs.constants.F_OK, (err) => {
  if (err) {
    fs.writeFile(filePath, 'Initial content.\n', (err) => {
      if (err) return console.error('Error creating file:', err);
      console.log('example.txt created with initial content.');
      continueWithReadAndWrite();
    });
  } else {
    continueWithReadAndWrite();
  }
});

function continueWithReadAndWrite() {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return console.error('Error reading file:', err);
    console.log('Read:', data);

    const newData = data + '\nAdding this line now.';
    fs.writeFile(filePath, newData, (err) => {
      if (err) return console.error('Error writing file:', err);
      console.log('File updated successfully.');
    });
  });
}