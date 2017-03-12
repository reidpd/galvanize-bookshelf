'use strict';

const express = require('express');
// const bcrypt = require('bcrypt-as-promised');

// eslint-disable-next-line new-cap
const app = express();
const router = express.Router();
const knex = require('../knex.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-as-promised');
const humps = require('humps');

router.get('/token', (req, res, next) => {
  jwt.verify(req.cookies.token, process.env.JWT_KEY, (err) => {
    if (err) {
      res.set('Content-Type', 'application/json');
      res.status(200).send(false);
    }
    else {
      res.set('Content-Type', 'application/json');
      res.status(200).send(true);
    }
  });
});

router.post('/token', (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    res.set('Content-Type', 'text/plain');
    res.status(400);
    if (!req.body.email) { res.send('Email must not be blank'); }
    else { res.send('Password must not be blank'); }
  }
  else {
    knex('users').where('email', req.body.email).then((userDataArray) => {
      const userInfo = userDataArray[0];
      if (userInfo === undefined) {
        res.set('Content-Type', 'text/plain');
        return res.status(400).send('Bad email or password');
      }
      bcrypt.compare(req.body.password, userInfo.hashed_password).then((userAuth) => {
        if (userAuth) {
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
          const responseObj = {
            id: userInfo.id,
            firstName: userInfo.first_name,
            lastName : userInfo.last_name,
            email: userInfo.email
          }

          res.status(200).send(responseObj);
        } else {
          res.status(400).send('Bad email or password');
        }
      }).catch((badPass) => {
        res.set('Content-Type', 'text/plain');
        res.status(400).send('Bad email or password');
      });
    });
  }
});

router.delete('/token', (req, res) => {
  res.cookie('token', '').status(200).send();
});

module.exports = router;
