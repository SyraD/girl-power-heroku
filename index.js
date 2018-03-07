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

var query =  "SELECT * FROM students";
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query(query, function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       {

            console.log(result);
            response.render('pages/index',  {results: result.rows})

       }
    });
  });

});

app.get('/login', function(request, response) {
  response.render('pages/login', {err: false});
});

app.post('/login', function(request, response) {
console.log(request.body);
var query =  "SELECT * FROM users WHERE username = '" + request.body.user + "' AND password = '" + request.body.password + "'";
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query(query, function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { console.log(result.rows.length);
            if(result.rows.length == 1){

                client.query("SELECT * FROM students", function(err, result) {
                  done();
                  if (err)
                   { console.error(err); response.send("Error " + err); }
                  else
                   {
                        response.render('pages/teacher', {results: result.rows} );
                   }
                });

            }
            else{
                console.log("invalid password");
                response.render('pages/login', {err: query} );
            }
       }
    });
  });

});
//UPDATE students SET graded = 'B' WHERE name = 'gluon';
app.post('/update', function(request, response) {
  console.log(request.body);
  var query =  "UPDATE students SET graded = '" + request.body.graded + "' WHERE name = '" + request.body.name + "'";
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query(query, function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       {
            console.log("success");
            response.send("success");
       }
    });
  });
});

app.post('/add', function(request, response) {
  console.log(request.body);
  var query =  "INSERT INTO students VALUES ('" + request.body.name + "', '" + request.body.graded + "')";
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query(query, function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       {
            console.log("success");
            response.send("success");
       }
    });
  });
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

var pg = require('pg');