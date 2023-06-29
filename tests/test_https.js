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

const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const fs = require('fs');
const http = require('http');
const https = require('https');

chai.use(chaiHttp);
const expect = chai.expect;

// Replace with the path to your server file
const server = require('../src/https');

describe('Server', () => {
  let readFileStub;
  let accessStub;
  let serverInstance;

  before(() => {
    // Stub the fs.readFile function
    readFileStub = sinon.stub(fs, 'readFile').callsFake((path, callback) => {
      // Return a dummy file content for testing
      callback(null, 'Dummy file content');
    });

    // Stub the fs.access function
    accessStub = sinon.stub(fs, 'access').callsFake((path, mode, callback) => {
      // Simulate file exists for testing
      callback(null);
    });
  });

  after(() => {
    // Restore the original fs.readFile function
    readFileStub.restore();

    // Restore the original fs.access function
    accessStub.restore();

    // Close the server instance
    serverInstance.close();
  });

  describe('HTTP Server', () => {
    before(() => {
      serverInstance = http.createServer(server);
      serverInstance.listen(3000);
    });

    describe('GET /index.html', () => {
      it('should return the content of index.html', (done) => {
        chai
          .request(serverInstance)
          .get('/index.html')
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.text).to.equal('Dummy file content');
            done();
          });
      });
    });

    describe('GET /styles/main.css', () => {
      it('should return the content of main.css', (done) => {
        chai
          .request(serverInstance)
          .get('/styles/main.css')
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.text).to.equal('Dummy file content');
            done();
          });
      });
    });

    describe('GET /images/test.jpg', () => {
      it('should return the content of test.jpg', (done) => {
        chai
          .request(serverInstance)
          .get('/images/test.jpg')
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.a('object');
            done();
          });
      });
    });

    describe('GET /nonexistent.html', () => {
      before(() => {
        // Stub the fs.access function to simulate file not found
        accessStub.callsFake((path, mode, callback) => {
          callback(new Error('File not found'));
        });
      });

      it('should return a 404 error', (done) => {
        chai
          .request(serverInstance)
          .get('/nonexistent.html')
          .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.text).to.equal('File not found!');
            done();
          });
      });
    });
  });

  describe('HTTPS Server', () => {
    before(() => {
      const privateKey = fs.readFileSync('/path/to/private.key', 'utf8'); // Replace with the path to your private key file
      const certificate = fs.readFileSync('/path/to/certificate.crt', 'utf8'); // Replace with the path to your certificate file

      const credentials = { key: privateKey, cert: certificate };
      serverInstance = https.createServer(credentials, server);
      serverInstance.listen(3001);
    });

    describe('GET /index.html', () => {
      it('should return the content of index.html', (done) => {
        chai
          .request(serverInstance)
          .get('/index.html')
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.text).to.equal('Dummy file content');
            done();
          });
      });
    });

    describe('GET /styles/main.css', () => {
      it('should return the content of main.css', (done) => {
        chai
          .request(serverInstance)
          .get('/styles/main.css')
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.text).to.equal('Dummy file content');
            done();
          });
      });
    });

    describe('GET /images/test.jpg', () => {
      it('should return the content of test.jpg', (done) => {
        chai
          .request(serverInstance)
          .get('/images/test.jpg')
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.a('object');
            done();
          });
      });
    });

    describe('GET /nonexistent.html', () => {
      before(() => {
        // Stub the fs.access function to simulate file not found
        accessStub.callsFake((path, mode, callback) => {
          callback(new Error('File not found'));
        });
      });

      it('should return a 404 error', (done) => {
        chai
          .request(serverInstance)
          .get('/nonexistent.html')
          .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.text).to.equal('File not found!');
            done();
          });
      });
    });
  });
});
