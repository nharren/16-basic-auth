'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;

const userSchema = Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  findHash: { type: String, unique: true }
});

userSchema.methods.generatePasswordHash = function(password) {
  debug('generatePasswordHash');

  return bcrypt.hash(password, 10)
    .then(passwordHash => {
      this.password = passwordHash;
      return Promise.resolve(this);
    });
}

userSchema.methods.comparePasswordHash = function(password) {
  debug('comparePasswordHash');

  return bcrypt.compare(password, this.password)
    .then(valid => {
      if (!valid) {
        let error = createError.Unauthorized();
        return Promise.reject(error);
      }
    });
}

userSchema.methods.generateFindHash = function() {
  debug('generateFindHash');

  return new Promise((resolve, reject) => {
    let tries = 0;

    function _generateFindHash() {
      this.findHash = crypto.randomBytes(32).toString('hex');
      this.save()
        .then(() => resolve(this.findHash))
        .catch(error => {
          if (tries > 3) {
            return reject(error);
          }

          tries++;
          _generateFindHash.call(this);
        });
    }
  });
}

userSchema.methods.generateToken = function() {
  debug('generateToken');

  return generateFindHash()
    .then(findHash => {
      let jwtString = jwt.sign({ token: findHash }, process.env.APP_SECRET);
      resolve(jwtString);
    })
    .catch(error => reject(error));
}

module.exports = mongoose.model('user', userSchema);