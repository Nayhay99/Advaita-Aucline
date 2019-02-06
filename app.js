const express = require('express');
const app = express();
const ejs = require('ejs');
const bodyParser = require('body-parser');
const http = require('http');
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const expressSession = require('express-session');
const expressValidator = require('express-validator')
const flash = require('connect-flash');

// routes
const registration = require('./routes/registration');
const homepage = require('./routes/homepage');
const contactUs = require('./routes/contactUs');

// connect mongoose
mongoose.connect("mongodb://localhost:27017/Aucline", { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error',console.error.bind(console,'Mongo connection error!'));

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname+'/public'));

// express session
app.use(expressSession({
    secret:"secret",
    saveUnitialized:true,
    resave:true
}));

app.use(flash());

// passport init
app.use(passport.initialize());
app.use(passport.session());

//  Express Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
  }));
  


app.use('/',registration);
app.use('/homepage',homepage);
app.use('/contactUs',contactUs);

// server
const port = process.env.PORT  || 3000;
app.set(port);
const server = http.createServer(app);
server.listen(port);
console.log('Server up and running');
module.exports =app;