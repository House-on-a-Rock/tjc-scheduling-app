import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import db from './db';

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req: any, res) => {
    const msg = 'Welcome to this API. ';
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
