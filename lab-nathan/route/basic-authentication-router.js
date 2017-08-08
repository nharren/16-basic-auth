'use strict';

const Router = require('express').Router;
const jsonParser = require('bodyparser').json();
const debug = require('debug')('basic-authentication-server:basic-authentication-router');

const basicAuthentication = require('../middleware/basic-authentication.js');

const basicAuthorizationRouter = new Router();

const User = require('../model/user.js');

basicAuthorizationRouter.post('/api/signup', jsonParser, function(request, response, next) {
  debug('POST: /api/signup');

  let password = request.body.password;
  delete request.body.password;

  let user = new User(request.body);
  user.generatePasswordHash(password)
    .then(user => user.save())
    .then(user => user.generateToken())
    .then(token => response.send(token))
    .catch(next);
});

basicAuthorizationRouter.get('/api/signin', basicAuthentication, function(request, response, next) {
  debug('GET: /api/signin');

  User.findOne({ username: request.authorization.username })
    .then(user => user.comparePasswordHash(request.authorization.password))
    .then(user => user.generateToken())
    .then(token => response.send(token))
    .catch(next);
});