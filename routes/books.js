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

router.get('/books', (req, res, err) => {
  knex('books').orderBy('title', 'asc')
  .then((books) => {
    res.status(200).send(books);
  }).catch((err) => {
    console.error(err);
  });
});

router.get('/books/:id', (req, res, err) => {
  knex('books')
  .where('id', '=', req.params.id)
  .then((book) => {
    res.status(200).send(book);
  }).catch((err) => {
    console.error(err);
  });
});

router.post('/books', (req, res, err) => {
  knex('books')
  .insert({
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    description: req.body.description,
    coverUrl: req.body.cover_url,
    createdAt: knex.fn.now(),
    updatedAt: knex.fn.now()
  }).then((book) => {
    res.status(200).send(book);
  }).catch((err) => {
    console.error(err);
  });
});

router.patch('/books/:id', (req, res, err) => {
  knex('books')
  .where('id', '=', req.params.id)
  .update({
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    description: req.body.description,
    cover_url: req.body.cover_url,
    updatedAt: knex.fn.now()
  }).then((book) => {
    res.status(200).send(book);
  }).catch((err) => {
    console.error(err);
  });
});

router.delete('/books/:id', (req, res, err) => {
  knex('books')
  .where('id', '=', req.params.id)
  .del()
  .then((book) => {
    res.status(200).send(book);
  }).catch((err) => {
    console.error(err);
  });
});

module.exports = router;
