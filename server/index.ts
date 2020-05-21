import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import db from './db';

const port = process.env.PORT || 8080;
const app: express.Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res) =>
    res.status(200).send({
        message: 'Welcome to this API.',
    }),
);

app.use('/api', require('./routes'));

const syncDb = () =>
    db.sequelize.sync().then(() => {
        app.listen(port, () => {
            console.log(`Server is running on PORT ${port}`);
        });
    });
syncDb();

export default db;
