const registration = require('../registration');
const assert = require('assert');
const pg = require("pg");
const Pool = pg.Pool;

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
describe('The basic database web app', function () {

    beforeEach(async function () {
        // clean the tables before each test run
        await pool.query("delete from reg;");
    });
    describe('Displaying registration numbers', async function () {
        const reg = registration(pool);
        it('should return CY 123-456, CA 027-496 and CJ 363-996', async function () {
            await reg.addRegNum('CY 123-456'),
                await reg.addRegNum('CA 027-496'),
                await reg.addRegNum('CJ 363-996')



            let returnReg = await reg.returnReg();
            assert.deepEqual([{ regno: 'CY 123-456' }, { regno: 'CA 027-496' }, { regno: 'CJ 363-996' }], returnReg);
        });
        it('should return CY 123-456, CA 027-496, CJ 363-996, CY 123456 and CJ 363000', async function () {
                await reg.addRegNum('CY 123-456'),
                await reg.addRegNum('CA 027-496'),
                await reg.addRegNum('CJ 363-996'),
                await reg.addRegNum('CY 123456'),
                await reg.addRegNum('CJ 363000')



            let returnReg = await reg.returnReg();
            assert.deepEqual([{ regno: 'CY 123-456' }, { regno: 'CA 027-496' }, { regno: 'CJ 363-996' }, { regno: 'CY 123456' }, { regno: 'CJ 363000' }], returnReg);
        });
        it('should not return duplicate registration numbers', async function () {
            await reg.addRegNum('CY 123-456'),
                await reg.addRegNum('CY 123-456'),
                await reg.addRegNum('CY 123-456'),
                await reg.addRegNum('CA 027-496'),
                await reg.addRegNum('CA 027-496'),
                await reg.addRegNum('CJ 363-996')


            let returnReg = await reg.returnReg();
            assert.deepEqual([{ regno: 'CY 123-456' }, { regno: 'CA 027-496' }, { regno: 'CJ 363-996' }], returnReg);
        });

    });
    describe('Filtering registration numbers', async function () {
        const reg = registration(pool);
        it('should return CA 027-496 and CA 363-996', async function () {
            await reg.addRegNum('CY 123-456'),
                await reg.addRegNum('CA 027-496'),
                await reg.addRegNum('CA 363-996')



            let show = await reg.showBtn('cpt');
            assert.deepEqual([{ regno: 'CA 027-496' }, { regno: 'CA 363-996' }], show);
        });
        it('should return CJ 555-666, CY 02147, CY 996332 and CY 54544', async function () {
            await reg.addRegNum('CJ 555-666'),
                await reg.addRegNum('CY 021470'),
                await reg.addRegNum('CY 996332'),
                await reg.addRegNum('CY 545442')




            let show = await reg.showBtn('bellville');
            assert.deepEqual([{ regno: 'CY 021470' }, { regno: 'CY 996332' }, { regno: 'CY 545442' }], show);
        });
        it('should return CA 027-496 and CA 363-996', async function () {
            await reg.addRegNum('CY 123-456'),
                await reg.addRegNum('CA 027-496'),
                await reg.addRegNum('CA 363-996')



            let show = await reg.showBtn('cpt');
            assert.deepEqual([{ regno: 'CA 027-496' }, { regno: 'CA 363-996' }], show);
        });
    });
});
after(function () {
    pool.end();
})
