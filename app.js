var express = require('express');
var app = express();

var port = 3000;

app.get("/", (req, res) => {
    res.send("Welcome to demo game backend");
});

app.listen(port, function () {
    console.log('Server running at http://127.0.0.1:' + port + '/');
});
