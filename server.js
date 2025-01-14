const path = require('path');
const exphbs = require('express-handlebars'); 
const routes = require('./controllers');
const helpers = require('./utils/helpers'); 
const express = require('express'); 
const session = require('express-session');
const sequelize = require('./config/connection'); 
const SequelizeStore = require('connect-session-sequelize')(session.Store);


const app = express();
const PORT = process.env.PORT || 3001;

// Set up Handlebars.js engine with custom helpers
const hbs = exphbs.create({ helpers });
 
const sess = {
  secret: 'Super secret secret',
  cookie: {
    maxAge: 300000,
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));
app.use(express.urlencoded({ extended: true }));
app.engine('handlebars', hbs.engine);
app.use(express.json());
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));
app.use(routes);
app.use("/images", express.static(path.join(__dirname, "/public/images")));

sequelize.sync();

app.listen(PORT, () => console.log(`Now listening on port http://localhost:${PORT}`));
