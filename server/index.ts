import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import Auth0Strategy from 'passport-auth0';
import db from './db';

const authRouter = require('./routes/auth');

const port = process.env.PORT || 8080;
const app: express.Application = express();

const strategy = new Auth0Strategy(
    {
        domain: process.env.AUTH0_DOMAIN,
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL || 'http://10.10.150.50:8080/callback',
    },
    function (accessToken, refreshToken, extraParams, profile, done) {
        extraParams = {
            audience: process.env.AUDIENCE,
        };
        return done(null, profile, accessToken);
    },
);

app.use(
    session({
        secret: 't-rex',
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000,
        },
        resave: false,
        saveUninitialized: true,
    }),
);

passport.use(strategy);

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

app.get('/', (req, res) => {
    let msg = 'Welcome to this API. ';
    console.log(req.authInfo);
    if (req.isAuthenticated()) {
        msg += 'Logged In';
    } else {
        msg += 'Logged Out';
    }
    res.status(200).send({
        message: msg,
    });
});

app.use('/api', require('./routes'));

app.use('/', authRouter);
const syncDb = () =>
    db.sequelize.sync().then(() => {
        app.listen(port, () => {
            console.log(`Server is running on PORT ${port}`);
        });
    });
syncDb();

export default db;
