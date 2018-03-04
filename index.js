var cool = require('cool-ascii-faces');
var express = require('express');
const bodyParser = require('body-parser');
const middlewares = [
  bodyParser.urlencoded()
];
var app = express();
var $ = require('jquery');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(middlewares);

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index')
});

app.get('/login', function(request, response) {
  response.render('pages/login');
});

app.post('/login', function(request, response) {
console.log(request.body.user);
console.log(request.body.password)
var query =  "SELECT * FROM users WHERE username = '" + request.body.user + "' AND password = '" + request.body.password + "'";
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query(query, function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('pages/db', {results: result.rows} ); }
    });
  });

});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

var pg = require('pg');

//app.get('/db', function (request, response) {
//var temp = '\' OR TRUE'
//  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
//    client.query('SELECT * FROM users', function(err, result) {
//      done();
//      if (err)
//       { console.error(err); response.send("Error " + err); }
//      else
//       { response.render('pages/db', {results: result.rows} ); }
//    });
//  });
//});