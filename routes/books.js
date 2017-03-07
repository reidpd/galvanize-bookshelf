// eslint-disable-next-line new-cap
/* eslint-disable camelcase */
'use strict';

const express = require('express');
const env = process.env.node_env || 'development';
const config = require('../knexfile.js')[env];
const knex = require('knex')(config);

const pg = require('pg');
const bodyParser = require('body-parser');

const router = express.Router();

router.use(bodyParser.json());

router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router.get('/books', (req, res) => {
  knex('books').orderBy('title', 'asc')
  .then((books) => {
    res.status(200).json(books);
  }).catch((err) => {
    console.log(err);
  });
});

router.get('/books/:id', (req, res) => {
  knex('books')
  .where('id', '=', req.params.id)
  .then((book) => {
    res.status(200).json(book[0]);
  }).catch((err) => {
    console.log(err);
  });
});

router.post('/books', (req, res) => {
  const BOOK = {
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    description: req.body.description,
    cover_url: req.body.cover_url
  };

  knex('books')
  .insert(BOOK)
  .then(() => {
    res.status(200).json(BOOK);
  }).catch((err) => {
    console.log('Houston, we have a problem!');
    console.log(err);
  });
});

router.patch('/books/:id', (req, res) => {
  knex('books')
  .where('id', '=', req.params.id)
  .returning('id')
  .update({
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    description: req.body.description,
    cover_url: req.body.cover_url
  }).then((response) => {
    console.log(response);
    res.status(200).json(response);
  }).catch((err) => {
    console.log(err);
  });
});

router.delete('/books/:id', (req, res) => {
  knex('books')
  .where('id', '=', req.params.id)
  .del()
  .then((response) => {
    console.log(response);
    const deletion = response[0];
    console.log(deletion);
    res.status(200).json(deletion);
  }).catch((err) => {
    console.log(err);
  });
});

module.exports = router;
