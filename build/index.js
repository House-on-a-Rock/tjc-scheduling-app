'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports['default'] = void 0;

var express = require('express');

var bodyParser = require('body-parser');

var cors = require('cors');

var path = require('path');

var db = require('./db');

var routes = require('./routes');

var port = process.env.PORT || 8000;
var app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(cors()); // app.get('/', (req, res, next) => {
//   console.log('Hello World');
//   res.send('Hello World');
//   next();
// });
// app.use('/api', routes);

app.use(function (req, res, next) {
  if (path.extname(req.path).length) {
    var error = new Error('Not Found'); // res.status(404);

    next(error);
  } else next();
}); // error handling endware

app.use(function (err, req, res, next) {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error.');
});

var syncDb = function syncDb() {
  return db.sequelize.sync().then(function () {
    app.listen(port, function () {
      console.log('Server is running on PORT '.concat(port));
    });
  });
};

syncDb();
var _default = db;
exports['default'] = _default;
//# sourceMappingURL=index.js.map
