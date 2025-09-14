require('dotenv').config();
var lambda = require("./index");
var express = require("express");
var cors = require("cors");
var app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
var port = 3000;

app.all('/{*splat}', async function (req, res) {    
    if (req.method === 'POST') {
        req.body = JSON.stringify(req.body);
        var lambdaResponcePromise = lambda.handler(req);
        var lambdaResponce= await lambdaResponcePromise;
        res.send(lambdaResponce);
    } else {
        res.send({ code: 221, msg: 'Invalid Request Type :' + req.method });
    }
});

app.listen(port, function () {
    console.log('Server running at http://127.0.0.1:' + port + '/');
});
