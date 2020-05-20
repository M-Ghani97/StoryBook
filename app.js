const express = require('express');
const path = require('path');
const handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const {
  allowInsecurePrototypeAccess,
} = require('@handlebars/allow-prototype-access');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const app = express();

//Passport Config
require('./config/passport')(passport);

//Loading Keys
const keys = require('./config/keys');

//Connect Mongoose
mongoose
  .connect(keys.mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database Connected'))
  .catch((err) => console.log(err));

//Load Routes
const auth = require('./routes/auth');
const index = require('./routes/index');
const stories = require('./routes/stories');

//Handlebar Helpers
const {
  truncate,
  stripTags,
  formatDate,
  compare,
  editicon,
} = require('./helpers/hbs');

//Body-Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Mehod Override Middleware
app.use(methodOverride('_method'));

//Handlebar Middleware
app.engine(
  'handlebars',
  exphbs({
    helpers: {
      truncate: truncate,
      stripTags: stripTags,
      formatDate: formatDate,
      compare: compare,
      editicon: editicon,
    },
    defaultLayout: 'main',
    handlebars: allowInsecurePrototypeAccess(handlebars),
  })
);
app.set('view engine', 'handlebars');

//Session Middleware
app.use(cookieParser());
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
  })
);

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Set Globar Users
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

//Using Routes
app.use('/', index);
app.use('/auth', auth);
app.use('/stories', stories);

//Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.port || 5000;
app.listen(port, () => {
  console.log(`Server Started on ${port}`);
});
