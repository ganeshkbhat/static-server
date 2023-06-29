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
const server = require('../src/http'); // Assuming the server code is in a separate file called server.js

chai.use(chaiHttp);
const expect = chai.expect;

describe('Server', () => {
  let readFileStub;
  let accessStub;

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
  });

  describe('GET /index.html', () => {
    it('should return the content of index.html', (done) => {
      chai
        .request(server)
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
        .request(server)
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
        .request(server)
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
        .request(server)
        .get('/nonexistent.html')
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.text).to.equal('File not found!');
          done();
        });
    });
  });
});
