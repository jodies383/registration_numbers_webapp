let express = require('express');
const exphbs = require('express-handlebars');
const handlebarSetup = exphbs({
    partialsDir: "./views/partials",
    viewPath: './views',
    layoutsDir: './views/layouts'
});
const bodyParser = require('body-parser');
const registration = require('./registration');
const app = express();

app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// const dbpool = new Pool({
//     connectionString: process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/users',
//     ssl: {
//         useSSL,
//       rejectUnauthorized: false
//     }
//   });
const reg = registration()

app.get('/', function (req, res) {
    let regNum = reg.returnReg()
    res.render('index', {
        listFormat: regNum
    });
});
app.post('/reg_numbers', function (req, res) {
    reg.addRegNum(req.body.enterNum)
    res.redirect('/')
});
app.get('/reg_numbers', function (req, res) {
    res.redirect('/')
})
let PORT = process.env.PORT || 3007;

app.listen(PORT, function () {
    console.log('App starting on port', PORT);
});

