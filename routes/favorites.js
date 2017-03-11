'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const app = express();
const router = express.Router();
const knex = require('../knex.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-as-promised');
const humps = require('humps');

router.get('/favorites', (req, res, next) => {
  jwt.verify(req.cookies.token, process.env.JWT_KEY, (err) => {
    if (err) {
      res.set('Content-Type', 'application/json');
      return res.sendStatus(401);
    }
    knex('favorites')
    .join('books', 'favorites.book_id', '=', 'books.id')
    .then((favoritesArray) => {
      res.set('Content-Type', 'application/json');
      res.status(200).send(humps.camelizeKeys(favoritesArray));
    });
  });
});

//specific favorite check
router.get('/favorites', (req, res, next) => {
  jwt.verify(req.cookies.token, process.env.JWT_KEY, (err) => {
    if (err) {
      res.set('Content-Type', 'application/json');
      return res.sendStatus(401);
    }
  });
});

router.post('/favorites/check', (req, res, next) => {
  jwt.verify(req.cookies.token, process.env.JWT_KEY, (err) => {
    if (err) {
      res.set('Content-Type', 'application/json');
      return res.sendStatus(401);
    }
  });
});

router.delete('/favorites', (req, res, next) => {
  jwt.verify(req.cookies.token, process.env.JWT_KEY, (err) => {
    if (err) {
      res.set('Content-Type', 'application/json');
      return res.sendStatus(401);
    }
  });
});

module.exports = router;
