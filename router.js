const debug = require('debug')('app:picem');
const express = require('express');
const path = require('path');

const app = express();

debug('initializing');

app.use(express.static(path.join(__dirname, '/public')));

module.exports = app;

