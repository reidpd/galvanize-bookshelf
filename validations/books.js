'use strict';

const Joi = require('joi');

module.exports.post = {
  body: {
    title: Joi.string()
      .required()
      .min(1)
      .trim(),
    author: Joi.string()
      .required()
      .min(1)
      .trim(),
    genre: Joi.string()
      .required()
      .min(1)
      .trim(),
    description: Joi.string()
      .required()
      .min(1)
      .trim(),
    coverUrl: Joi.string()
      .required()
      .min(1)
      .trim()
  }
};

module.exports.patch = {
  params: { id: Joi.number().integer().greater(0) },
  body: {
    title: Joi.string()
      .required()
      .min(1)
      .trim(),
    author: Joi.string()
      .required()
      .min(1)
      .trim(),
    genre: Joi.string()
      .required()
      .min(1)
      .trim(),
    description: Joi.string()
      .required()
      .min(1)
      .trim(),
    coverUrl: Joi.string()
      .required()
      .min(1)
      .trim()
  }
};
