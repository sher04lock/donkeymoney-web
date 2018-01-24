const path = require('path');
const express = require('express');
const app = express();

/**
 * Simple express.js server to serve static files on Heroku 
 */


 
/**
 * Force using https connection
 */
const forceSSL = function() {
  return function (req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(['https://', req.get('Host'), req.url].join(''));
    }
    next();
  }
}

app.use(forceSSL());

/**
 * Set app to serve files in dist folder
 */
app.use(express.static(__dirname + '/dist'));

/**
 * All request redirect to index.html. 
 * Angular App handles all routing across modules itself.
 */
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

/**
 * Start app on standard Heroku port
 */
app.listen(process.env.PORT || 8080);