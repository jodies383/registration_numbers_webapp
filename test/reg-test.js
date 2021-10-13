const registration = require('../registration');
const assert = require('assert');
const pg = require("pg");
//const greetFactory = require('../greetFactory');
const Pool = pg.Pool;

// we are using a special test database for the tests
let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/registration',
    ssl: {
        useSSL,
        rejectUnauthorized: false
    }
});

describe('Registration numbers', function () {
    const reg = registration();
    it('should return CY 123-456', function () {
        (reg.addRegNum('CY 123-456'),

            assert.equal(reg.returnReg('CY 123-456'), 'CY 123-456'));
    });
    after(function () {
        pool.end();
    })
});