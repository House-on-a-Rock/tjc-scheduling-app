import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import path from 'path';
import db from './db';

const port = process.env.PORT || 8080;
const app: express.Application = express();
const DIST_DIR = path.resolve(__dirname, '../dist');
const HTML_FILE = path.join(DIST_DIR, 'index.html');

app.use(express.static(DIST_DIR));

app.use(
  session({
    secret: 't-rex',
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
    resave: false,
    saveUninitialized: true,
  }),
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/api', require('./routes'));
app.use('/api', require('./routes/churches'));
app.use('/api', require('./routes/users'));
app.use('/api', require('./routes/tasks'));
app.use('/api', require('./routes/requests'));
app.use('/api', require('./routes/user-roles'));
app.use('/api', require('./routes/notifications'));
app.use('/api', require('./routes/schedules'));
app.use('/api', require('./routes/services'));

app.use('*', (req, res) => {
  console.log('am i hit');
  res.sendFile(HTML_FILE);
});

app.use((req, res, next) => {
  const error = new Error('Not Found');
  res.status(404);
  next(error);
});

const syncDb = () =>
  db.sequelize.sync().then(() => {
    app.listen(port, () => {
      console.log(`Server is running on PORT ${port}`);
    });
  });
syncDb();

export default db;
