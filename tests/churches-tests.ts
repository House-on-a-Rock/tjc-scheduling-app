import dotenv from 'dotenv';
import { expect } from 'chai';
import request, { Options } from 'request-promise';
import jwt, { Algorithm } from 'jsonwebtoken';
import fs from 'fs';
import db from '../server/index';

dotenv.config();

const userIdString = '1';

const privateKey = fs.readFileSync('tjcschedule.pem');

const token = jwt.sign(
    {
        iss: process.env.AUDIENCE,
        sub: `tjc-scheduling|${userIdString}`,
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        type: 'test',
    },
    {
        key: privateKey,
        passphrase: process.env.PRIVATEKEY_PASS,
    },
    { algorithm: process.env.JWT_ALGORITHM as Algorithm },
);

describe('Churches', function () {
    const options: Options = {
        uri: `http://localhost:8080/api/churches`,
        headers: { authorization: token },
        json: true,
    };

    // positive tests
    describe('GET /', function () {
        it('returns status 200', function (done) {
            request.get(options, function (err, response, body) {
                expect(response.statusCode).to.equal(200);
                done();
            });
        });

        it('returns churches object', function (done) {
            request.get(options, function (err, response, body) {
                expect(response.body).to.be.an('array');
                done();
            });
        });
    });
    options.body = {
        name: 'test',
        address: 'test',
        description: 'test',
    };
    describe('POST /', function () {
        it('returns status 201', function (done) {
            request.post(options, function (err, response, body) {
                expect(response.statusCode).to.equal(201);
                done();
            });
        });

        it('creates a database entry in the Churches table', function (done) {
            db.Church.findOne({
                where: { name: 'test' },
                attributes: ['id', 'name'],
            }).then(function (data) {
                expect(data).to.be.an('object');
                data.destroy();
                done();
            });
        });
    });
});
