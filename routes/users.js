'use strict';

// eslint-disable-next-line new-cap
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-as-promised');
const knex = require('../knex.js');
const humps = require('humps');

router.post('/users', (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    res.set('Content-Type', 'text/plain');
    res.status('400');
    if (!req.body.email) { res.send('Email must not be blank'); }
    else { res.send('Password must be at least 8 characters long'); }
  }
  else {
    const injectedUser = {
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      email: req.body.email
    };
    knex('users').select('email').where('email', req.body.email).then((response) => {
      if (response.length!==0) {
        res.set('Content-Type', 'text/plain');
        res.status(400).send('Email already exists');
      }
      else {
        bcrypt.hash(req.body.password, 1)
        .then((hashed_password) => {
          const newUser = {
            first_name: req.body.firstName,
            last_name: req.body.lastName,
            email: req.body.email,
            hashed_password: hashed_password
          };
          knex('users').insert(newUser, '*').then((newInsertedUser) => {
            const injectedUser = {
              id: newInsertedUser[0].id,
              first_name: newInsertedUser[0].first_name,
              last_name: newInsertedUser[0].last_name,
              email: newInsertedUser[0].email
            };
            res.status(200).json(humps.camelizeKeys(injectedUser));
          });
        }).catch((err) => {
          console.error(err);
        });
      }
    });
  }
});

module.exports = router;
