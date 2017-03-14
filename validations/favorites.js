'use strict';

const Joi = require('joi');

module.exports.post = {
  body: {
    bookId: Joi.number()
      .integer()
      .greater(0)
  }
};
