import dotenv from 'dotenv';
import { expect } from 'chai';
import request, { Options } from 'request-promise';
import db from '../server/index';
import { createToken } from '../server/utilities/helperFunctions';

dotenv.config();

let queryId;
const userIdString = '1';

const token = createToken('test', userIdString, 60);

describe('Users', function () {
  const options: Options = {
    uri: `http://localhost:8080/api/users`,
    headers: { authorization: token },
    json: true,
  };

  describe('GET /', function () {
    it('returns status 200', function (done) {
      request.get(options, function (err, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      });
    });

    it('returns object with all users', function (done) {
      request.get(options, function (err, response, body) {
        const size = body.length;
        expect(body).to.be.an('array');
        expect(size).to.be.above(1);
        done();
      });
    });

    it('returns user object belonging to requesting user', function (done) {
      options.uri = `http://localhost:8080/api/users/${userIdString}`;
      request.get(options, function (err, response, body) {
        expect(response.body).to.be.an('object');
        done();
      });
    });
  });

  describe('POST /', function () {
    it('returns status 201', function (done) {
      options.uri = `http://localhost:8080/api/users`;
      options.body = {
        firstName: 'test',
        lastName: 'test',
        email: 'test',
        password: 'test',
      };
      request.post(options, function (err, response, body) {
        expect(response.statusCode).to.equal(201);
        done();
      });
    });

    it('creates a new user entry', function (done) {
      db.User.findOne({
        where: { firstName: 'test' },
        attributes: ['id'],
      }).then(function (user) {
        queryId = user.id;
        expect(user).to.be.an('object');
        // user.destroy();
        done();
      });
    });
  });

  describe('DELETE /', function () {
    it('returns status 200', function (done) {
      options.uri = `http://localhost:8080/api/users/${queryId}`;
      delete options.body;
      request.delete(options, function (err, response, body) {
        expect(response.statusCode).to.equal(200);
        expect(body.message).to.equal('User deleted');
        done();
      });
    });
    it('removes test user', function (done) {
      db.User.findOne({ where: { firstName: 'test' } }).then(function (user) {
        expect(user).to.equal(null);
        done();
      });
    });
  });
});
