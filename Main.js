const express       = require('express')
const app           = express();
const path          = require('path');
const mysql         = require('mysql');
const session       = require('express-session');
const MySQLStore    = require('express-mysql-session')(session);
const Router        = require('./Router');

app.use(express.static(path.join(__dirname,'dist')));
app.use(express.json());
app.use(express.static('public'))

const db = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: '',
    database: 'userapp'
});
db.connect(function(err){
    if(err){
    console.log('DB error');
    throw err;
    return false;
    }
    console.log('connected')
});

const sessionStore = new MySQLStore({
    expiration: (1825 * 86400 * 1000),
    endConnectionOnClose: false
},db);
app.use(session({
    key: 'fsfsfsfssff',
    secret: 'adfsdfsfds',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge:(1825 * 86400 * 1000),
        httpOnly: false
    }
}));



new Router(app,db);

app.get('/',function(req,res){
    res.sendFile(path.join(__dirname,'dist','index.html'));

});
const PORT = process.env.PORT || 5000;

console.log("Server started");
app.listen(PORT);
