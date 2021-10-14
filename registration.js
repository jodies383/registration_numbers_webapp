module.exports = function (pool) {

    var regEx = /^[a-zA-Z]{2} [0-9]{3}(-[0-9]{3})$|[a-zA-Z]{2} [0-9]{3}([0-9]{3})$|[a-zA-Z]{2} ([0-9]{3} [0-9]{3})$|[a-zA-Z]{2} ([0-9]{4})$/i;

    async function addRegNum(enterNum) {
        if (enterNum) {
            let upperNum = enterNum.toUpperCase()
            if (regEx.test(upperNum)) {
                let checknum = await pool.query(`SELECT regNo from reg WHERE regNo = $1`, [upperNum]);
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

        let checknum = await pool.query(`SELECT regNo from reg WHERE regNo = $1`, [upperNum]);

        if (!checknum.rowCount < 1) {
            req.flash('info', 'Registration number already exists');
        } else if (!regEx.test(enterNum)) {
            req.flash('info', 'Please enter a valid registration number');
        }
    }

    async function returnReg() {
        const result = await pool.query('select regNo from reg')
        let regValue = result.rows;
        return regValue

    }
    async function selectRegId(reg) {
        let upperReg = reg.toUpperCase()
        let select = await pool.query('select id from towns where regCode = $1', [upperReg])
        return select.rows[0].id;
    }
    async function showBtn(btn, req) {
        if (btn === "cpt") {
            let cpt = await pool.query("select regno from reg where reg_id = '1'")
            return cpt.rows
        } else if (btn === "paarl") {
            let paarl = await pool.query("select regno from reg where reg_id = '2'")
            return paarl.rows
        } else if (btn === "bellville") {
            let bellville = await pool.query("select regno from reg where reg_id = '3'")
            return bellville.rows
        } else if (btn === 'all') {
            let all = await pool.query("select regno from reg")
            return all.rows
        }
        else if (!btn) {
            req.flash('info', 'Please select a town');
        }
    }
    async function showBtnError(btn, req) {
        let cpt = await pool.query("select regno from reg where reg_id = '1'")
        let paarl = await pool.query("select regno from reg where reg_id = '2'")
        let bellville = await pool.query("select regno from reg where reg_id = '3'")
        let all = await pool.query("select regno from reg")

        if (btn === "cpt" && cpt.rowCount === 0) {
            req.flash('info', 'No registration numbers found');
        }
        if (btn === "paarl" && paarl.rowCount === 0) {
            req.flash('info', 'No registration numbers found');
        }
        if (btn === "bellville" && bellville.rowCount === 0) {
            req.flash('info', 'No registration numbers found');
        }
        if (btn === "all" && all.rowCount === 0) {
            req.flash('info', 'No registration numbers found');
        }
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
        showBtnError,
        reset
    }
}

