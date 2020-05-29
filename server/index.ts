import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import request from 'request-promise';
import openid from 'express-openid-connect';
import db from './db';

const port = process.env.PORT || 8080;
const app: express.Application = express();

const config = {
    required: false,
    auth0Logout: true,
    appSession: {
        secret: process.env.CLIENT_SECRET,
    },
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    authorizationParams: {
        response_type: 'code',
        audience: process.env.AUDIENCE,
        scope: 'openid profile email read:AllUsers',
    },
    clientSecret: process.env.CLIENT_SECRET,
    handleCallback: function (req, res, next) {
        req.session.openidTokens = req.openidTokens;
        next();
    },
};

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

app.use(openid.auth(config));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res) => {
    let msg = 'Welcome to this API. ';
    console.log(req.authInfo);
    if (req.user) {
        msg += 'Logged In';
    } else {
        msg += 'Logged Out';
    }
    res.status(200).send({
        message: msg,
    });
});

app.use('/api', require('./routes'));

const syncDb = () =>
    db.sequelize.sync().then(() => {
        app.listen(port, () => {
            console.log(`Server is running on PORT ${port}`);
        });
    });
syncDb();

export default db;
