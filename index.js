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

const port = process.argv[3];

if (process.argv[4] === "secure") {
  server = require("./src/https");
} else {
  server = require("./src/http");
}


server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
