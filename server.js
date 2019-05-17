'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var dns = require('dns');
var cors = require('cors');
var bodyParser = require('body-parser');
var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
mongoose.connect(process.env.MONGO_URI,{useNewUrlParser: true});

//creating the model with schema

var UrlShortener = new mongoose.Schema ({
 "original_url": String,
 "short_url": String
});

var urlShortenerModel = mongoose.model("urlShortenerModel", UrlShortener);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({extended: 'false'}));
app.use(bodyParser.json());

//use css

app.use('/public', express.static(process.cwd() + '/public'));

//get html
app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

//post original url, but make sure it is valid first
app.post('/api/shorturl/new', function(req, res){
    var originalUrl = req.body.url;
    var domainName = originalUrl.replace(/(^\w+:|^)\/\//, "");
    dns.lookup(domainName, function(error,url){
    if(error){
    res.json({"error": "invalid URL"});
    } else{
          var shortenedUrl = Math.floor(Math.random()*100000);
          res.json({"original_url": originalUrl, "short_url": shortenedUrl});
          }
    });
  
  //saving original url and short url in db in order to be able to get it after
  
  
});


//when the short url is visited redirect to original url
app.get('/api/shorturl/(*)', function(req, res){
//have to use findOne function here and then req. redirect()
res.json({});
});

app.listen(port, function () {
  console.log('Node.js listening ...');
});