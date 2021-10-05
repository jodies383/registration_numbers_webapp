module.exports = function (pool) {

    // function registration(existingReg) {

    //var regNum = []

    var regEx = /^[A-Z]{2} [0-9]{3}(-[0-9]{3})$|[A-Z]{2} [0-9]{3}([0-9]{3})$|[A-Z]{2} ([0-9]{3} [0-9]{3})$|[A-Z]{2} ([0-9]{4})$/i;

    async function addRegNum(enterNum) {
        if (enterNum) {
            let upperNum = enterNum.toUpperCase()
            if (regEx.test(upperNum)) {
                let checknum = await pool.query(`SELECT regNo from reg WHERE regNo = $1`, [upperNum]);

                if (checknum.rowCount < 1) {

                    await pool.query(`INSERT INTO reg (regNo) VALUES ($1)`, [upperNum])
                }

            }
        }
    }
    async function returnReg() {
        const result = await pool.query('select regNo from reg')
        let regValue = result.rows;
            console.log(regValue);
        return regValue

    }
    async function reset() {
        let deleted = await pool.query('delete from reg')

        return deleted
    }
    function validReg(enterNum) {
        if (!regEx.test(enterNum)) {
            return "Please enter a valid registration number"
        }
    }
    function sameReg() {
        return "Registration number already exists"

    }

    function towns(checkedRadioBtn) {
        var cptArr = regNum.filter((reg) => reg.startsWith("CA"))
        var paarlArr = regNum.filter((reg) => reg.startsWith("CJ"))
        var belArr = regNum.filter((reg) => reg.startsWith("CY"))

        if (checkedRadioBtn === "cpt") {
            return cptArr
        } else if (checkedRadioBtn === "paarl") {
            return paarlArr
        } else if (checkedRadioBtn === "bellville") {
            return belArr
        } else if (checkedRadioBtn === "all") {
            return regNum
        } else if (cptArr.length === 0 || paarlArr.length === 0 || belArr.length === 0 || regNum.length === 0) {
            return noTownFound()
        }


    }

    function noTownFound() {
        return ("No registration numbers found")
    }



    function noTowns(RadioBtn) {

        if (!RadioBtn) {
            return "Please select a town"
        } else return ""

    }

    return {
        addRegNum,
        sameReg,
        validReg,
        towns,
        noTowns,
        returnReg,
        reset,
        noTownFound
    }
}
