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
const https = require('https');
const fs = require('fs');
const path = require('path');
const hashers = require("hasher-apis");
// const pem = require('pem');


const directory = process.argv[2]; // Replace with the desired directory
const port = process.argv[3];

let server, private, public;

function comparekeys(objectOne, ObjectTwo) {
  const keys1 = Object.keys(objectOne);
  const keys2 = Object.keys(ObjectTwo);

  if (keys1.length !== keys2.length) return false;
  keys1.sort();
  keys2.sort();

  for (let i = 0; i < keys1.length; i++) {
    const key1 = keys1[i];
    const key2 = keys2[i];
    if (key1 !== key2) return false;

    const value1 = objectOne[key1];
    const value2 = ObjectTwo[key2];

    if (typeof value1 === 'object' && typeof value2 === 'object') {
      const keysMatch = this.comparekeys(value1, value2);
      if (!keysMatch) return false;
    }
  }
  return true;
}

function generateKeys(storePath) {
  const { publicKey, privateKey } = hashers._genKeyPair();
  let pbk = hashers._dumpKeyFile(path.join(storePath, "public"), publicKey);
  let pvk = hashers._dumpKeyFile(path.join(storePath, "private"), privateKey);
  if (!!pbk && !!pvk) return true;
  return false;
}


if (process.argv[4] === 'secure') {
  if (!process.argv[5] || !process.argv[6]) generateKeys(process.argv[2]);

  const privateKey = fs.readFileSync(!!process.argv[5] ? path.join(process.argv[5]) : path.join(directory, "private.pem"), 'utf8'); // Replace with the path to your private key file
  const certificate = fs.readFileSync(!!process.argv[6] ? path.join(process.argv[6]) : path.join(directory, "public.pem"), 'utf8'); // Replace with the path to your certificate file

  const credentials = { key: privateKey, cert: certificate };
  server = https.createServer(credentials);
}

server.on('request', (req, res) => {
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
