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














    return {
        home,
        addNum,
        show,
        resetBtn
    }

}