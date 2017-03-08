// eslint-disable-next-line new-cap
/* eslint-disable camelcase */
'use strict';

const express = require('express');
const env = process.env.node_env || 'test';
const config = require('../knexfile.js')[env];
const knex = require('knex')(config);

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
    console.log(err);
  });
});

router.get('/books/:id', (req, res) => {
  // let booksLength;
  // knex('books').max('id').then((max_num) => { booksLength = max_num; });
  // if (req.params.id > booksLength - 1 || req.params.id < 0 || Number.isNaN(req.params.id)) {
  //   res.set('Content-Type', /plain/).status(404).send('Not Found');
  //   next();
  // }
  knex('books')
  .where('id', '=', req.params.id)
  .then((book) => {
    res.status(200).json(humps.camelizeKeys(book[0]));
  }).catch((err) => {
    console.log(err);
  });
});

router.post('/books', (req, res) => {
  const newBook = {
    // id: 9,
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    description: req.body.description,
    cover_url: req.body.coverUrl
  };

  knex('books')
  .insert(humps.decamelizeKeys(newBook))
  .then(() => {
    res.status(200).json(humps.camelizeKeys(newBook));
  }).catch((err) => {
    console.log('Houston, we have a problem!');
    console.log(err);
  });
});

router.patch('/books/:id', (req, res) => {
  const updatedBook = {
    id: req.params.id,
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    description: req.body.description,
    cover_url: req.body.coverUrl
  };

  knex('books')
  .where('id', '=', req.params.id)
  .update(humps.decamelizeKeys(updatedBook))
  .then(() => {
    res.status(200).json(humps.camelizeKeys(updatedBook));
  }).catch((err) => {
    console.log(err);
  });
});

router.delete('/books/:id', (req, res) => {
  let deletion;
  knex('books').select('title', 'author', 'genre', 'description', 'cover_url').where('id', '=', req.params.id).then((obj) => { deletion = obj; });
  knex('books').where('id', '=', req.params.id).del()
  .then(() => {
    res.status(200).json(humps.camelizeKeys(deletion[0]));
  }).catch((err) => {
    console.log(err);
  });
});

module.exports = router;
