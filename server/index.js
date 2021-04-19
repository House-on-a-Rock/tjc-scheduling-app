import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import db from './db';

const port = process.env.PORT || 8081;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// app.use(express.static(DIST_DIR));

app.get('/', (req, res, next) => {
  console.log('Hello World');
  res.send('Hello World');
  next();
});

app.use('/api', require('./routes'));
app.use('/api', require('./routes/churches'));
app.use('/api', require('./routes/users'));
app.use('/api', require('./routes/tasks'));
app.use('/api', require('./routes/requests'));
app.use('/api', require('./routes/user-roles'));
app.use('/api', require('./routes/notifications'));
app.use('/api', require('./routes/schedules'));
app.use('/api', require('./routes/services'));
app.use('/api', require('./routes/roles'));
app.use('/api', require('./routes/templates'));
app.use('/api', require('./routes/events'));

app.use((req, res, next) => {
  if (path.extname(req.path).length) {
    const error = new Error('Not Found');
    // res.status(404);
    next(error);
  } else next();
});

// error handling endware
app.use((err, req, res, next) => {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error.');
});

const syncDb = () =>
  db.sequelize.sync().then(() => {
    app.listen(port, () => {
      console.log(`Server is running on PORT ${port}`);
    });
  });
syncDb();

export default db;
