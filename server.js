var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
app.use('/', express.static(__dirname + '/build'));

server.listen(8000, '0.0.0.0', 511, function() {
    // // Once the server is listening we automatically open up a browser
    //var open = require('open');
    //open('http://localhost:' + 1688 + '/');
});