module.exports = function (pool) {

    const registration = require('../registration')
    const reg = registration(pool)


    async function home(req, res) {
        let regNum = await reg.returnReg()
        res.render('index', {
            listFormat: regNum
        });
    }
    async function addNum(req, res) {
        await reg.errors(req.body.enterNum, req)
        await reg.addRegNum(req.body.enterNum)
        res.redirect('/')
    }
    async function show(req, res) {
        let showReg;
        if (!req.body.towns) {
            req.flash('info', 'Please select a town')
        }
        if (req.body.towns === "all") {
            showReg = await reg.returnReg()
        }
        else {
            let regi = await reg.showBtn(req.body.towns, req)
            if (req.body.towns) {
                if (regi.rowCount === 0) {
                    req.flash('info', 'No registration numbers found')
                }
                else {
                    let registration = await reg.showBtn(req.body.towns, req)
                    showReg = registration.rows
                }
            }
        }

        res.render('index', {
            listFormat: showReg
        });
    }
    async function resetBtn(req, res) {
        await reg.reset(req)
        res.redirect('/')
    }
    async function showReg(req, res) {
        let users = req.params.reg
        res.render('reg_numbers', {
            reg: users
        });
    }

    return {
        home,
        addNum,
        show,
        resetBtn,
        showReg
    }

}