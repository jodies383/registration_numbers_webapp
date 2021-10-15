module.exports = function (pool) {

    var regEx = /^[a-zA-Z]{2} [0-9]{3}(-[0-9]{3})$|[a-zA-Z]{2} [0-9]{3}([0-9]{3})$|[a-zA-Z]{2} ([0-9]{3} [0-9]{3})$|[a-zA-Z]{2} ([0-9]{4})$/i;

    async function addRegNum(enterNum) {
        if (enterNum) {
            let upperNum = enterNum.toUpperCase()
            if (regEx.test(upperNum)) {
                let checknum = await pool.query(`SELECT regNo from reg WHERE regNo = $1`, [upperNum])
                let codes = enterNum.substring(0, 2)

                if (checknum.rowCount < 1) {
                    let regId = await selectRegId(codes)
                    await pool.query(`INSERT INTO reg (regNo, reg_id) VALUES ($1, $2)`, [upperNum, regId])
                }
            }
        }
    }
    async function errors(enterNum, req) {
        let upperNum = enterNum.toUpperCase()

        let checknum = await pool.query(`SELECT regNo from reg WHERE regNo = $1`, [upperNum])

        if (!checknum.rowCount < 1) {
            req.flash('info', 'Registration number already exists')
        } else if (!regEx.test(enterNum)) {
            req.flash('info', 'Please enter a valid registration number')
        }
    }

    async function returnReg() {
        const result = await pool.query('select regNo from reg')
        let regValue = result.rows
        return regValue

    }
    async function selectRegId(reg) {
        if (reg) {
            let upperReg = reg.toUpperCase()
            let select = await pool.query('select id from towns where regCode = $1', [upperReg])
            return select.rows[0].id
        }
    }
    async function showBtn(btn) {
        let getTownId = await selectRegId(btn)
        let specificTown = await pool.query("select regno from reg where reg_id = $1", [getTownId])
        return specificTown


    }
   
    async function reset(req) {
        let deleted = await pool.query('delete from reg')
        req.flash('success', 'Registration numbers successfully reset')

        return deleted
    }

    return {
        addRegNum,
        errors,
        returnReg,
        selectRegId,
        showBtn,
        reset
    }
}

