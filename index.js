var express = require('express');
var router = require('./router/main_route');
var app = express();
var port = 8083;

app.set('view engine', 'ejs');
app.use('/', express.static(__dirname + '/public'));
app.use('/', router);

app.listen(port, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Server running in ' + port);
    }
});