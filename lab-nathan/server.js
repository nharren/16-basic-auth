'use strict';

const express = require('express');
const dotenv = require('dotenv');
const debug = require('debug')('basic-authorization-server:server');

const app = express();
dotenv.config();

app.listen(process.env.PORT, function() {
  debug(`Listening on port ${process.env.PORT}.`);
});