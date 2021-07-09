import path from 'path';

import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';

import db from './db';

const port = process.env.PORT || 8081;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

//prod to use static files in dist folder
app.use(express.static(path.join(__dirname, '../dist')));

//prod to serve static files in dist folder
app.get('/', (req, res, next) => {
  res.send('Hello Ted');
  res.sendFile(path.join(__dirname, '..', 'dist/index.html'));
  next();
});

app.use('/api/auth', require('./routes/authentication').default);
app.use('/api', require('./routes/churches').default);
app.use('/api', require('./routes/users').default);
app.use('/api', require('./routes/tasks').default);
app.use('/api', require('./routes/requests').default);
app.use('/api', require('./routes/user-roles').default);
app.use('/api', require('./routes/notifications').default);
app.use('/api', require('./routes/schedules').default);
app.use('/api', require('./routes/services').default);
app.use('/api', require('./routes/roles').default);
app.use('/api', require('./routes/templates').default);
app.use('/api', require('./routes/events').default);

app.use((req, res, next) => {
  if (path.extname(req.path).length) {
    const error = new Error('Not Found');
    // res.status(404);
    next(error);
  } else next();
});

// error handling endware
// call next({message, status}) inside catch, and we send the response here
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json(err || { message: 'Internal server error.' });
});

const syncDb = () =>
  db.sequelize.sync().then(() => {
    app.listen(port, () => {
      console.log(`Server is running on PORT ${port}`);
    });
  });

syncDb();

export default db;
