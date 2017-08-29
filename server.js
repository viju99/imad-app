var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');

var config = {
    user: 'viju99',
    database: 'viju99',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: 'db-viju99-18966'
    //password: process.env.DB_PASSWORD
};


var app = express();
app.use(morgan('combined'));

//telling express in case you see json content load the json content in the req.body variable
app.use(bodyParser.json());

var articles = {
    'article-one': {
    title: 'Article One | Vijay Sankar',
    heading: 'Article One',
    date: 'May 9, 2018',
    content: `
     <p>
    This is the content for my first article.This is the content for my first article.This is the content for my first article.This is the content for my first article.This is the content for my first article.This is the content for my first article.
    </p>
    <p>
    This is the content for my first article.This is the content for my first article.This is the content for my first article.This is the content for my first article.This is the content for my first article.This is the content for my first article.
    </p>
    `},
    'article-two': {
    title: 'Article Two | Vijay Sankar',
    heading: 'Article Two',
    date: 'May 10, 2018',
    content: `
     <p>
        This is the content for my second article.
    </p>
    `
    },
    'article-three': {
    title: 'Article Three | Vijay Sankar',
    heading: 'Article Three',
    date: 'May 11, 2018',
    content: `
     <p>
        This is the content for my third article.
    </p>
    `
    }
};

var articleOne = {
    title: 'Article One | Vijay Sankar',
    heading: 'Article One',
    date: 'May 9, 2018',
    content: `
     <p>
    This is the content for my first article.This is the content for my first article.This is the content for my first article.This is the content for my first article.This is the content for my first article.This is the content for my first article.
    </p>
    <p>
    This is the content for my first article.This is the content for my first article.This is the content for my first article.This is the content for my first article.This is the content for my first article.This is the content for my first article.
    </p>
    `
};

function createTemplate (data) {
    var title = data.title;
    var heading = data.heading;
    var date = data.date;
    var content = data.content;
    
    var htmlTemplate = `
    <html>
        <head>
            <title>
                ${title}
            </title>
            <meta name="viewport" content="width=device-width, initial-scale-1" />
            <link href="/ui/style.css" rel="stylesheet" />
    
        </head>
        <body>
            <div class= "container">
                <div>
                    <a href="/">Home</a>
                </div>
                <hr/>
                <h3>
                    ${heading}
                </h3>
                <div>
                    ${date}
                </div>
                <div>
                    ${content}
                </div>
            </div>
        </body>
    </html>
    `;
    return htmlTemplate;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

function hash(input, salt){
    //how do we create a hash
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    //return hashed.toString('hex');
    return["pbkdf2", "10000", salt, hashed.toString('hex')].join('$');
}

app.get('/hash/:input', function(req,res){
    var hashedString = hash(req.params.input, 'this-is-some-random-string');
    res.send(hashedString);
});

app.post('/create-user', function(req, res){
    //username, password
    //JSON
    var username = req.body.username;
    var password = req.body.password;
    var salt = crypto.randomBytes(128).toString('hex');
    var dbString = hash(password, salt)
    pool.query('INSERT INTO "user" (username, password) VALUES($1, $2)', [username, dbString], function(err, result){
        if(err){
            res.status(500).send(err.toString());
        } else {
            res.send('User successfully created: ' + username);
        }
        
    });
});

app.post('/login', function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    pool.query('SELECT * FROM "user"  WHERE username = $1', [username], function(err, result){
        if(err){
            res.status(500).send(err.toString());
        } else {
            if(result.rows.lengtj === 0){
                res.send(403).sned('username/password is invalid');
            }
            else{
                var dbString = result.rows[0].password;
                var salt = dbString.split('$')[2];
                var hashedPassword = hash(password, salt); //creating a hash based on the pwd submitted
                if (hashedPassword === dbString) {
                    res.send('Credentials correct');
                }
                else {
                    res.send(403).sned('username/password is invalid');
                }
            }
            
        }
        
    });
});


var pool = new Pool(config);
app.get('/test-db',  function(req,res){
    //make a select request
    pool.query('SELECT * FROM test', function(err, result){
        if(err){
            res.status(500).send(err.toString());
        } else {
            res.send(JSON.stringify(result));
        }
    });
    //return a response with the results
});


var counter = 0;
app.get('/counter', function(req,res){
    counter = counter + 1;
    res.send(counter.toString());
});

app.get('/:articleName', function (req, res) {
    //articleName will be article-one
    var articleName = req.params.articleName;
    res.send(createTemplate(articles[articleName]));
});
/*
app.get('/article-two', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'article-two.html'));
});

app.get('/article-three', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'article-three.html'));
});
*/
app.get('/article-two', function (req, res) {
  res.send('Article two requested and will be served here');
});

app.get('/article-three', function (req, res) {
  res.send('Article three requested and will be served here');
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
