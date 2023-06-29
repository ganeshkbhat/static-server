/**
 * 
 * Package: httpserve
 * Author: Ganesh B
 * Description: Nodejs npm module to traverse folder using code or cli or use glob patterns
 * Install: npm i httpserve --save
 * Github: https://github.com/ganeshkbhat/static-serve
 * npmjs Link: https://www.npmjs.com/package/httpserve
 * File: index.js
 * File Description: 
 * 
*/

/* eslint no-console: 0 */

'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const directory = process.argv[2]; // Replace with the desired directory
const port = process.argv[3];

const server = http.createServer((req, res) => {
  // Get the requested file path relative to the specified directory
  const requestedPath = path.join(directory, req.url);

  // Get the absolute path of the requested file
  const filePath = path.resolve(requestedPath);

  // Check if the requested file is within the specified directory
  if (!filePath.startsWith(directory)) {
    res.statusCode = 403;
    res.end('Forbidden!');
    return;
  }

  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.statusCode = 404;
      res.end('File not found!');
      return;
    }

    // Determine the content type based on the file extension
    const ext = path.extname(filePath);
    let contentType = 'text/html';
    if (ext === '.css') {
      contentType = 'text/css';
    } else if (ext === '.png') {
      contentType = 'image/png';
    }

    // Read the file and serve it with the appropriate content type
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end('Error reading the file!');
        return;
      }

      res.setHeader('Content-Type', contentType);
      res.statusCode = 200;
      res.end(data);
    });
  });
});

module.exports = server;
