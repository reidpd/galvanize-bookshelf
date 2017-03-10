'use strict';

const express = require('express');
const bcrypt = require('bcrypt-as-promised');

// eslint-disable-next-line new-cap
const app = express();
const router = express.Router();
const knex = require('../knex.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-as-promised');
const humps = require('humps');
const cookieParser = require('cookie-parser');

router.post('/token', (req, res) => {
//   bcrypt.hash(req.body.password, 11) // use bcrypt to crypt the password
//   .then((hashPass) => { // if the password matches the hashing process...
//     knex('users').where('email', '=', req.body.email).andWhere(p)
//   });
  // knex('users').select('password').where('email', '=', req.body.email).then((password) => {
  //   bcrypt.compare(req.body.password, );
  // })
});

// app.use('/', (req, res) => {
//   knex('users').where('email', '=', req.body.)
// });


router.get('/token', (req, res) => {

});

router.post('/token', (req, res) => {

});

router.get('/token', (req, res) => {

});




module.exports = router;
