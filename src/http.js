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
const secure = process.argv[4]; // secure=pr.key,pub.crt
const privateKeyPath = process.argv[4].split("=")[1]?.split(",")[0]; // secure=./path/to/pr.key,./path/to/pub.crt
const publicKeyPath = process.argv[4].split("=")[1]?.split(",")[1]; // secure=./path/to/pr.key,./path/to/pub.crt
var list = process.argv[5].split("=")[1]; // list=false || list=true || list={format:'json',names:['index','index.json','/']}

if (list === "false" || list === false) list = false;
if (list === "true" || list === true) list = true;

if (!!list && typeof list !== "boolean") {
  list = JSON.parse(list);
}

const index = process.argv[6] === "index" ? "index.html" : false; // index || (0 || noindex || undefined)

const privateKey = fs.readFileSync(!!privateKeyPath ? path.join(privateKeyPath) : path.join(__dirname, directory, "../certs/", "private.pem"), 'utf8'); // Replace with the path to your private key file
const certificate = fs.readFileSync(!!publicKeyPath ? path.join(publicKeyPath) : path.join(__dirname, directory, "../certs/", "public.pem"), 'utf8'); // Replace with the path to your certificate file
// console.log(path.join(__dirname, directory, "../../", "private.pem"), path.join(__dirname, "../", directory));

const credentials = { key: privateKey, cert: certificate };
const fastify = require('fastify')({ logger: true, http2: (!!secure) ? true : false, https: (!!secure) ? { allowHTTP1: true, ...credentials } : false });

fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, "../", directory),
  index: (!!list) ? false : index,
  list: list
  // prefix: '/public/', // optional: default '/'
  // constraints: { host: 'example.com' } // optional: default {}
});

module.exports = fastify;
