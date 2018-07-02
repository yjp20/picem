const express = require('express');

const config = require('./config');

const app = express();

app.use(config.prefix, require('./router.js'));

app.listen(config.port);
