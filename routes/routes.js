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
        await reg.addRegNum(req.body.enterNum, req);
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
        let newCount = await greeted.regList(users)

        res.render('index', {
            reg: newCount
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