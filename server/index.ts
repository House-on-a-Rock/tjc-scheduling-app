import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import openid from 'express-openid-connect';
import db from './db';
import auth_config from './authConfig';

const port = process.env.PORT || 8080;
const app: express.Application = express();

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

app.use(openid.auth(auth_config));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req: any, res) => {
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
