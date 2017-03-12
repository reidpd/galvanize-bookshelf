'use strict';

// eslint-disable-next-line new-cap
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-as-promised');
const knex = require('../knex.js');
const jwt = require('jsonwebtoken');
const humps = require('humps');

router.post('/users', (req, res, next) => {
  // if email or password are empty, send appropriate error message
  if (!req.body.email || !req.body.password) {
    res.set('Content-Type', 'text/plain');
    res.status('400');
    if (!req.body.email) { res.send('Email must not be blank'); }
    else { res.send('Password must be at least 8 characters long'); }
  }
  // else, search db for user whose email matches req body email to reject duplicate usernames
  else {
    knex('users').select('email').where('email', req.body.email).then((response) => {
      if (response.length!==0) { // if user already
        res.set('Content-Type', 'text/plain');
        res.status(400).send('Email already exists');
      }
      // if email is unknown, hash given password and tie it to newUser entry
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
            const claim = { userId: req.body.email }; // this is our 'session'

            const token = jwt.sign(claim, process.env.JWT_KEY, { // use this environment variable to sign the cookie
              expiresIn: '7 days'  // Adds an exp field to the payload
            });

            const opts = {
              httpOnly: true,
              expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),  // 7 days
              secure: router.get('env') === 'production'  // Set from the NODE_ENV
            };
            res.cookie('token', token, opts);
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
