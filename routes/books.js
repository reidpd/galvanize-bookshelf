// eslint-disable-next-line new-cap
/* eslint-disable camelcase */
// eslint-disable newline-after-var
/* eslint-disable max-len*/
'use strict';

const express = require('express');
const knex = require('../knex.js');

const pg = require('pg');
const bodyParser = require('body-parser');
const humps = require('humps');

const router = express.Router();

router.use(bodyParser.json());

router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router.get('/books', (req, res) => {
  knex('books').orderBy('title', 'asc')
  .then((books) => {
    res.status(200).json(humps.camelizeKeys(books));
  }).catch((err) => {
    console.error(err);
  });
});

router.get('/books/:id', (req, res, next) => {
  if (isNaN(req.params.id) || req.params.id < 0) { next(); }
  knex('books')
  .where('id', req.params.id)
  .then((book) => {
    if (book.length===0) { next(); }
    res.status(200).json(humps.camelizeKeys(book[0]));
  }).catch(() => {
    next();
  });
});

router.post('/books', (req, res) => {
  if (!req.body.title || !req.body.author || !req.body.genre || !req.body.description || !req.body.coverUrl) {
    res.set('Content-Type', 'plain/text');
    res.status('400');
    if (!req.body.title) { res.send('Title must not be blank'); }
    else if (!req.body.author) { res.send('Author must not be blank'); }
    else if (!req.body.genre) { res.send('Genre must not be blank'); }
    else if (!req.body.description) { res.send('Description must not be blank'); }
    else if (!req.body.cover_url) { res.send('Cover URL must not be blank'); }
  } else {
    const newBook = {
      // id: 9,
      title: req.body.title,
      author: req.body.author,
      genre: req.body.genre,
      description: req.body.description,
      cover_url: req.body.coverUrl
    };

    knex('books')
    .insert(newBook, "*")
    .then((newInsertedBook) => {
      res.status(200).send(humps.camelizeKeys(newInsertedBook[0]));
    }).catch((err) => {
      console.log('Houston, we have a problem!');
      console.log(err);
    });
  }
});

router.patch('/books/:id', (req, res, next) => {
  if (isNaN(req.params.id) || req.params.id < 1) { next(); }
  const updatedBook = {
    id: req.params.id,
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    description: req.body.description,
    cover_url: req.body.coverUrl
  };
  knex('books').where('id', req.params.id).then((response) => {
    if (response.length === 0) {
      next();
    }
    else {
      knex('books').where('id', req.params.id).update(updatedBook)
      .then(() => {
        res.set('Content-Type', 'application/json');
        return res.status(200).json(humps.camelizeKeys(updatedBook));
      }).catch((err) => {
        next();
      });
    }
  })
});

router.delete('/books/:id', (req, res, next) => {
  if (isNaN(req.params.id) || req.params.id < 1) {
    next();
  } else {
    let deletion;
    knex('books')
    .select('title', 'author', 'genre', 'description', 'cover_url')
    .where('id', '=', req.params.id)
    .then((obj) => {
      if (obj.length===0) { next(); } else {
        deletion = obj;
        knex('books').where('id', '=', req.params.id).del()
        .then(() => {
          res.status(200).json(humps.camelizeKeys(deletion[0]));
        }).catch((err) => {
          console.log(err);
          next();
        });
      }
    });
  }
});

module.exports = router;
