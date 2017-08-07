'use strict';

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const debug = require('debug')('basic-authorization-server:server');


const app = express();
dotenv.config();

app.use(cors());
app.use(morgan('dev'));

app.listen(process.env.PORT, function() {
  debug(`Listening on port ${process.env.PORT}.`);
});