'use strict';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const app = express();

app.disable('x-powered-by');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

switch (app.get('env')) {
  case 'development':
    app.use(morgan('dev'));
    break;

  case 'production':
    app.use(morgan('short'));
    break;

  default:
}

app.use(bodyParser.json());
app.use(cookieParser());

const path = require('path');

app.use(express.static(path.join('public')));

// CSRF protection
app.use((req, res, next) => {
  if (/json/.test(req.get('Accept'))) {
    return next();
  }

  res.sendStatus(406);
});

const books = require('./routes/books');
const favorites = require('./routes/favorites');
const token = require('./routes/token');
const users = require('./routes/users');

app.use(books);
app.use(favorites);
app.use(token);
app.use(users);

// app.use((_req, res) => {
//   res.sendStatus(404);
// });
app.use('/', (req,res) => {
  res.set('Content-Type', 'plain/text');
  res.status(404).send('Not Found');
});

// eslint-disable-next-line max-params

// this code was used for original master, when errors had statusCodes and messages
// app.use((err, _req, res, _next) => {
//   console.log('goes to expected server fn');
//   if (err.output && err.output.statusCode) {
//     return res
//       .status(err.output.statusCode)
//       .set('Content-Type', 'text/plain')
//       .send(err.message);
//   }
//
//   // eslint-disable-next-line no-console
//   console.error(err.stack);
//   res.sendStatus(500);
// });

// this fn is purely for validations branch
app.use((err, _req, res, _next) => {
  res.set('Content-Type', 'text/plain');
  if (err.status) {
    return res.status(err.status).send(err);
  }
  console.error(err);
  res.sendStatus(500);
})

const port = process.env.PORT || 8000;

app.listen(port, () => {
  if (app.get('env') !== 'test') {
    // eslint-disable-next-line no-console
    console.log('Listening on port', port);
  }
});

module.exports = app;
