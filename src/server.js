'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

var JsonDB = require('node-json-db');
var DataError = require("node-json-db/lib/Errors").DataError;
var db = new JsonDB("squaresDB", true, false);

app.use(bodyParser.json({limit: '1mb'}));

var args = process.argv.slice(2);
var dev = process.env.NODE_ENV != 'production';

// Init DB 

let data = db.getData('/');
if (data.set == undefined) {
    db.push('/set', {});
}


app.use('/static', express.static(__dirname + '/static'));

//Routes

app.get('/', function(req, res) {
    if (dev) {
        res.sendFile(__dirname+'/indexDev.html');
    } else {
        res.sendFile(__dirname+'/index.html');
    }
})

app.get('/sets', function(req, res) {
    let sets = db.getData('/set');
    res.send(Object.keys(sets));
})

app.get('/set/:setid', function(req, res, next) {
    let points = db.getData('/set/'+req.params.setid)
    res.send(points);
})

app.post('/set/:setid', function(req, res) {
    db.push('/set/'+req.params.setid, req.body.points)
    res.send("OK");
})

app.delete('/set/:setid', function(req, res){
    db.delete('/set/'+req.params.setid);
    res.send("OK");
})


// Error handling
app.use(function(err, req, res, next){
    if (err instanceof DataError) {
        return next()
    }
    console.log(err);
    res.status(500).send("Internal error");
})

// Not found
app.use(function(req, res) {
    res.status(404).send("Nothing here, move along");
})


app.listen(3000, function(){
    console.log('Server running on port 3000');
})