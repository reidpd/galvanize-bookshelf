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
    }).catch((err) => {
      console.log(err);
    });
  });
});

//specific favorite check
router.get('/favorites/check/', (req, res, next) => {
  const id = Number(req.query.bookId);
  if (isNaN(id)) {
    res.set('Content-Type', 'text/plain');
    return res.status(400).send('Book ID must be an integer');
  }
  jwt.verify(req.cookies.token, process.env.JWT_KEY, (err) => {
    if (err) {
      res.set('Content-Type', 'application/json');
      return res.sendStatus(401);
    }
    knex('favorites')
    .join('books', 'favorites.book_id', '=', 'books.id')
    .where('favorites.book_id', '=', id)
    .then((response) => {
      res.set('Content-Type', 'application/json');
      if (response.length === 0) {
        res.status(200).send(false);
      } else {
        res.status(200).send(true);
      }
    });
  });
});

router.post('/favorites', (req, res, next) => {
  const bookId = req.body.bookId;
  if (isNaN(bookId)) {
    res.set('Content-Type', 'text/plain');
    return res.status(400).send('Book ID must be an integer');
  }
  knex('books').select('id').where('id', bookId).then((response) => {
    if (response.length===0) {
      res.set('Content-Type', 'text/plain');
      return res.status(404).send('Book not found');
    }
  });
  jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, payload) => {
    if (err) {
      res.set('Content-Type', 'application/json');
      return res.sendStatus(401);
    }
    knex('users').select('id').where('users.email', payload.userId).then((response) => {
      const userId = response[0].id;
      const newEntry = {
        book_id: bookId,
        user_id: userId
      }
      console.log(newEntry);
      knex('favorites').insert(newEntry, '*').then( (response) => {
        const insertedFavorite = response[0];
        const insertedEntry = {
          id: insertedFavorite.id,
          book_id: insertedFavorite.book_id,
          user_id: insertedFavorite.user_id
        };
        res.status(200).send(humps.camelizeKeys(insertedEntry));
      });
    })
  });
});

router.delete('/favorites', (req, res, next) => {
  const bookId = req.body.bookId;
  if (isNaN(bookId)) {
    res.set('Content-Type', 'text/plain');
    return res.status(400).send('Book ID must be an integer');
  }
  jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, payload) => {
    if (err) {
      res.set('Content-Type', 'application/json');
      return res.sendStatus(401);
    }
    // function goal: delete the favorites entry which matches both the current user and the book with the id specified in the request obj
    knex('users').select('id').where('users.email', payload.userId).then((response) => {
      const userId = response[0].id;
      knex('favorites').where('book_id', bookId).andWhere('user_id', userId).then((response) => {
        if (response.length === 0) {
          res.set('Content-Type', 'text/plain');
          return res.status(404).send('Favorite not found');
        }
        const deletionId = response[0].id;
        const deletionObj = {
          bookId: response[0].book_id,
          userId: response[0].user_id
        };

        knex('favorites').where('id', deletionId).del().then(() => {
          res.set('Content-Type', 'application/json');
          res.status(200).send(deletionObj);
        });
      });
    });
  });
});

module.exports = router;
