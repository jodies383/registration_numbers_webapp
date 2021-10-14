module.exports = function (pool) {

    const registration = require('../registration');
    const reg = registration(pool)


    async function home(req, res) {
        let regNum = await reg.returnReg();
        res.render('index', {
            listFormat: regNum
        });
    }
    async function addNum(req, res) {
        await reg.errors(req.body.enterNum, req)
        await reg.addRegNum(req.body.enterNum);
        res.redirect('/')
    }
    async function show(req, res) {
        let show = await reg.showBtn(req.body.towns, req);
        res.render('index', {
            listFormat: show
        });
    }
    async function resetBtn(req, res) {
        await reg.reset()
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