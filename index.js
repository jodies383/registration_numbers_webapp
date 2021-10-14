const pg = require("pg");
const Pool = pg.Pool;
let express = require('express');
const exphbs = require('express-handlebars');
const handlebarSetup = exphbs({
    partialsDir: "./views/partials",
    viewPath: './views',
    layoutsDir: './views/layouts'
});
const bodyParser = require('body-parser');
const registration = require('./routes/routes');
const flash = require('express-flash');
const session = require('express-session');
const app = express();
app.use(session({
    secret: "registration",
    resave: false,
    saveUninitialized: true
}));
app.use(flash());
app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}
const dbpool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/registration',
    ssl: {
        useSSL,
        rejectUnauthorized: false
    }
});
const reg = registration(dbpool)

app.get('/', reg.home);
app.post('/reg_numbers', reg.addNum);
app.get('/reg_numbers/:reg', reg.showReg);
app.post('/show', reg.show);

app.post('/reset', reg.resetBtn);

let PORT = process.env.PORT || 3007;

app.listen(PORT, function () {
    console.log('App starting on port', PORT);
});

