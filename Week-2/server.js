const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;
const filesDir = path.join(__dirname, 'files');

if (!fs.existsSync(filesDir)) {
  fs.mkdirSync(filesDir);
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const query = parsedUrl.query;
  const fileName = query.name;
  const filePath = path.join(filesDir, fileName || '');

  res.setHeader('Access-Control-Allow-Origin', '*');

  if (parsedUrl.pathname === '/create') {
    const content = query.content || 'Empty File';
    fs.writeFile(filePath, content, (err) => {
      if (err) {
        res.writeHead(500);
        res.end('Error creating file');
      } else {
        res.writeHead(200);
        res.end(`File '${fileName}' created.`);
      }
    });
  }

  else if (parsedUrl.pathname === '/read') {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end(`File '${fileName}' not found.`);
      } else {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(data);
      }
    });
  }

  else if (parsedUrl.pathname === '/delete') {
    fs.unlink(filePath, (err) => {
      if (err) {
        res.writeHead(404);
        res.end(`File '${fileName}' not found.`);
      } else {
        res.writeHead(200);
        res.end(`File '${fileName}' deleted.`);
      }
    });
  }

  else if (parsedUrl.pathname === '/list') {
    fs.readdir(filesDir, (err, files) => {
      if (err) {
        res.writeHead(500);
        res.end('Error reading file list');
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(files));
      }
    });
  }

  else {
    res.writeHead(404);
    res.end('Invalid route. Use /create, /read, /delete, or /list.');
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
