module.exports = function (pool) {

    var regEx = /^[A-Z]{2} [0-9]{3}(-[0-9]{3})$|[A-Z]{2} [0-9]{3}([0-9]{3})$|[A-Z]{2} ([0-9]{3} [0-9]{3})$|[A-Z]{2} ([0-9]{4})$/i;

    async function addRegNum(enterNum, req) {
        if (enterNum) {
            let upperNum = enterNum.toUpperCase()
            if (regEx.test(upperNum)) {
                let checknum = await pool.query(`SELECT regNo from reg WHERE regNo = $1`, [upperNum]);
                let codes = enterNum.substring(0, 2)

                if (checknum.rowCount < 1) {
                    let regId = await selectRegId(codes)
                    await pool.query(`INSERT INTO reg (regNo, reg_id) VALUES ($1, $2)`, [upperNum, regId])
                } else if (!checknum.rowCount < 1) {
                    req.flash('info', 'Registration number already exists');
                }

            }
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
        let select = await pool.query('select id from towns where regCode = $1', [reg])
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
        } else if (btn === "cpt" || "paarl" || "bellville" && !cpt || !paarl || !bellville){
            req.flash('info', 'No registration numbers found')
        }
    }
    async function reset() {
        let deleted = await pool.query('delete from reg')

        return deleted
    }
    async function regList(reg) {
        let usersTotal = await pool.query('select regno from reg WHERE regno = $1', [reg])
        let counted = usersTotal.rows[0];
        let newCount = counted;

        return newCount

    }

    return {
        addRegNum,
        returnReg,
        selectRegId,
        showBtn,
        reset,
        regList
    }
}
