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
  next();
});

router.post('/token', (req, res, done) => {
  knex('users').where('email', '=', req.body.email).then((userDataArray) => {
    const userInfo = userDataArray[0];
    bcrypt.compare(req.body.password, userInfo.hashed_password).then((userAuth) => {
      console.log('compared!');
      if (userAuth) {
        console.log('res turned true');
        const claim = { userId: req.body.email }; // this is our 'session'
        console.log('we got a claim');
        const token = jwt.sign(claim, process.env.JWT_KEY, { // use this environment variable to sign the cookie
          expiresIn: '7 days'  // Adds an exp field to the payload
        });
        console.log('token made');
        const opts = {
          httpOnly: true,
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),  // 7 days
          secure: router.get('env') === 'production'  // Set from the NODE_ENV
        };
        console.log('cookie time...');
        res.cookie('token', token, opts);
        done();
      } else {
        res.status(200).send(false);
        done();
      }
    });
  });
});

// app.use('/', (req, res) => {
//   knex('users').where('email', '=', req.body.)
// });


//
// router.post('/token', (req, res) => {
//
// });
//
// router.get('/token', (req, res) => {
//
// });




module.exports = router;
