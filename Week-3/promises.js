const fs = require('fs/promises');
const path = require('path');

const filePath = path.join(__dirname, 'example.txt');

async function updateFile() {
  try {
    let data;
    try {
      data = await fs.readFile(filePath, 'utf8');
      console.log('File content:', data);
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.log('File not found. Creating...');
        await fs.writeFile(filePath, 'Initial content.\n');
        data = 'Initial content.\n';
      } else {
        throw err;
      }
    }

    const updated = data + '\nNew line added.';
    await fs.writeFile(filePath, updated);
    console.log('File updated successfully.');

  } catch (err) {
    console.error('Unexpected Error:', err.message);
  }
}

updateFile();