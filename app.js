const express = require('express');

const config = require('./config');

const app = express();

app.use(config.prefix, require('./router.js'));

app.listen(config.port, () => {
  console.log('app listening on port: ' + config.port + ' with prefix: ' + config.prefix);
});
