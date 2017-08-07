'use strict';

const express = require('express');
const dotenv = require('dotenv');
const debug = require('debug')('basic-authorization-server:server');

const app = express();
dotenv.config();

app.listen(PORT, function() {
  debug(`Listening on port ${PORT}.`);
});