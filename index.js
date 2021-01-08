var express = require('express');
var bodyParser = require('body-parser');
var expressLayouts = require('express-ejs-layouts');
var query = require('./db')
var app = express();
var port = 8083;

app.listen(port, function (err) {
    if (err) {
        console.log(err)
    } else {
        console.log('Server running in ' + port)
    }
});

app.use(expressLayouts);
app.use(express.bodyParser());
app.set('view engine', 'ejs');
app.use('/', express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.render('pages/home')
    //res.send('GET')
});

app.post('/dados', function (req, res) {
    query(req.body)
    res.send('OK')
});