'use strict';

// eslint-disable-next-line new-cap
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-as-promised');
const knex = require('../knex.js');
const humps = require('humps');

router.post('/users', (req, res) => {
  const injectedUser = {
    first_name: req.body.firstName,
    last_name: req.body.lastName,
    email: req.body.email
  };

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
});

module.exports = router;
