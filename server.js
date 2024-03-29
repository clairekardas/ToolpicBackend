const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const rateLimit = require("express-rate-limit");

const app = express();

// Limit requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

//  apply to all requests
app.use(limiter);

const PORT = 65324;


const emulatorRouter = require(__dirname + '/Emulator.js');

// Set request headers for accessing API from outside
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Route to emulator
app.use('/emulate', emulatorRouter);

const ssl = true;

if (ssl) {
	const credentials = {
		key: fs.readFileSync('/etc/letsencrypt/live/api.fridaysforfuture.de/privkey.pem', 'utf8'),
		cert: fs.readFileSync('/etc/letsencrypt/live/api.fridaysforfuture.de/cert.pem', 'utf8'),
		ca: fs.readFileSync('/etc/letsencrypt/live/api.fridaysforfuture.de/chain.pem', 'utf8')
	};

  https.createServer(credentials, app).listen(PORT);
  console.log('(SSL) Example app listening on port ' + PORT + '!');
}
else {
  http.createServer(app).listen(PORT);
  console.log('(HTTP) Example app listening on port ' + PORT + '!');
}
